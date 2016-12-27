var Idea = require('../models/idea');
var Settings = require('../config/settings');
var ASQ = require('asynquence');
var toTitleCase = require('../utils/title-case');

module.exports = function(app) {

  /* Create Idea given business._id */
  app.post('/ideas/:bus_id', function(req, res) {
    var newIdea = new Idea(req.body);
    newIdea.business = req.params.bus_id;

    //Make sure name is title cased for sorting
    if (newIdea.name && newIdea.name !== null) {
      newIdea.name = toTitleCase(newIdea.name);
    }

    newIdea.save(function(err) {
      if (err) console.error('Error in /api/ideas/:bus_id post route: ' + err );
      res.json({ info: 'Idea created successfully', idea: newIdea });
    });

  });

  /* Read All Ideas */
  app.get('/ideas', function(req, res) {
    Idea.find(function(err, ideas) {
      if (err) {
        console.error('Error in Read all Ideas route: ' + JSON.stringify(err, null, 4));
        res.json({ info: 'Error during find ideas', error: err });
      }
      res.json({ info: 'Ideas found successfully', ideas: ideas });
    });
  });

  /* Read All Active Ideas */
  app.get('/ideas/active', function(req, res) {
    Idea.find({ status: 'Active' }, function(err, ideas) {
      if (err) {
        console.error('Error in Read all Ideas route: ' + JSON.stringify(err, null, 4));
        res.json({ info: 'Error during find ideas', error: err });
      }
      res.json({ info: 'Ideas found successfully', ideas: ideas });
    });
  });

  /* Read all Ideas associated with a Business ID */
  app.get('/ideas/business/:id', function(req, res) {
    //Return an array of all ideas associated with the bus_id
    var id = req.params.id;
    Idea.find({business: id}).sort({name: 1}).exec(function(err, ideas) {
      if (err) {
        res.json({ info: 'Error during find business ideas by ID', error: err });
      }
      res.json({ info: 'Ideas found successfully', ideas: ideas });
    });
  });

  /* Read One Idea By Idea ID */
  app.get('/api/ideas/:id', function(req, res) {
    Idea.findById(req.params.id, function(err, idea) {
      if (err) {
        res.json({ info: 'Error during find idea by ID', error: err });
      }
      res.json({ info: 'Idea found successfully', idea: idea });
    });
  });

  /* Update One Idea By Idea ID */
  app.put('/ideas/:id', function(req, res) {
    var props = req.body;

    //Make sure name is title cased for sorting
    if (props.name && props.name !== null) {
      props.name = toTitleCase(props.name);
    }
    Idea.findByIdAndUpdate(req.params.id, { $set: props}, function (err, idea) {
      if (err) {
        console.error('Error updating item: ' + JSON.stringify(err, null, 4));
        res.json({ info: 'Error during Update Idea by ID', error: err });
      } else {
        res.json({ info: 'Idea updated successfully', idea: idea });
      }
    });
  });

  /* Delete One Idea By Idea ID */
  app.delete('/ideas/:id', function(req, res) {
    Idea.findById(req.params.id, function(err, idea) {
      if (err) console.error('Error during find idea by ID: ' + err );

      //Remove Idea from MongoDB
      idea.remove(function(err) {
        if (err) console.error('Error during delete idea by ID: ' + err );
        res.json({ info: 'Successfully deleted idea with ID ' + req.params.id });
      });
    });

  });

}
