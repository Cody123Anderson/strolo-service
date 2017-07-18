const { Idea, Location } = require('../models');
const { sequelize } = require('../services/database');
const { shuffleArray } = require('../utils/shuffle');

exports.getAllIdeas = (req, res) => {
  Idea.findAll({
    include: [{
      model: Location,
      as: 'locations',
      through: { attributes: [] }
    }],
    order: sequelize.col('title')
  }).then((ideas) => {
    return res.status(200).send({ ideas });
  }).catch(err => {
    console.error('error in getAllIdeas controller: ', err);
    return res.status(500).send({
      error: 'unable to retrieve ideas',
      details: err
    });
  });
};

exports.getIdeasForStatus = (req, res) => {
  const { status } = req.params;

  Idea.findAll({
    where: { status },
    include: [{
      model: Location,
      as: 'locations',
      through: { attributes: [] }
    }],
    order: sequelize.col('title')
  }).then((ideas) => {
    const shuffledIdeas = shuffleArray(ideas);

    return res.status(200).send({ ideas: shuffledIdeas });
  }).catch(err => {
    console.error('error in getIdeasForStatus controller: ', err);
    return res.status(500).send({
      error: 'unable to retrieve ideas',
      details: err
    });
  });
}

exports.getIdeasForBusiness = (req, res) => {
  const { businessId } = req.params;

  Idea.findAll({
    where: { businessId },
    include: [{
      model: Location,
      as: 'locations',
      through: { attributes: [] }
    }],
    order: sequelize.col('title')
  }).then((ideas) => {
    return res.status(200).send({ ideas });
  }).catch(err => {
    console.error('error in getIdeasForBusiness controller: ', err);
    return res.status(500).send({
      error: 'unable to retrieve ideas',
      details: err
    });
  });
}

exports.getIdeasWithinRadius = (req, res) => {
  return res.status(200).send({
    ideas: {
      info: 'This endpoint hasn\'t been implemented yet!'
    }
  });
}

exports.getIdea = (req, res) => {
  const { id } = req.params;

  Idea.findOne({
    where: { id },
    include: [{
      model: Location,
      as: 'locations',
      through: { attributes: [] }
    }],
  }).then(idea => {
    return res.status(200).send({ idea });
  }).catch(err => {
    console.error('Error in getIdea controller: ', err);
    return res.status(500).send({
      error: 'unable to retrieve idea',
      details: err
    });
  });
}

exports.createIdea = (req, res) => {
  const newIdea = req.body;
  const locationIds = newIdea.locationIds || [];

  if (!newIdea.title) {
    return res.status(422).send({
      error: 'You must provide a title'
    });
  } else if (!newIdea.businessId) {
    return res.status(422).send({
      error: 'You must provide a businessId'
    });
  }

  if (newIdea.locationIds) {
    delete newIdea.locationIds;
  }

  Idea.create(newIdea).then(idea => {
    if (locationIds.length > 0) {
      // There's locations to add to this idea
      Location.findAll({
        where: { id: { $in: locationIds } }
      }).then(locations => {
        if (locations.length > 0) {
          idea.addLocations(locations);
        }

        return res.status(200).send({
          info: 'new idea created!',
          idea: idea
        });
      })
      .catch(err => {
        console.error('error creating idea: ', err);
        return res.status(500).send({
          error: 'server error creating idea',
          details: err
        });
      });
    } else {
      // No locations to add to idea
      return res.status(200).send({
        info: 'new idea created!',
        idea: idea
      });
    }
  }).catch(err => {
    console.error('error creating idea: ', err);
    return res.status(500).send({
      error: 'server error creating idea',
      details: err
    });
  });
}

exports.updateIdea = (req, res) => {
  const { id } = req.params;
  const newIdeaFields = req.body;
  const locationIds = newIdeaFields.locationIds || [];

  Idea.findOne({ where: { id } }).then(idea => {
    idea.update(newIdeaFields, { where: { id } }).then(() => {
      if (locationIds.length > 0) {
        // There's locations to add to this idea
        Location.findAll({
          where: { id: { $in: locationIds } }
        }).then(locations => {
          if (locations.length > 0) {
            idea.setLocations(locations);
          }

          return res.status(200).send({
            info: 'idea updated successfully!'
          });
        })
        .catch(err => {
          console.error('error updating idea: ', err);
          return res.status(500).send({
            error: 'server error updating idea',
            details: err
          });
        });
      } else {
        // No locations to add to idea
        return res.status(200).send({
          info: 'idea updated successfully!'
        });
      }
    }).catch(err => {
      console.error('error updating idea: ', err);
      return res.status(500).send({
        error: 'server error updating idea',
        details: err
      });
    });
  }).catch(err => {
    console.error('error updating idea: ', err);
    return res.status(500).send({
      error: 'server error updating idea',
      details: err
    });
  });
}

exports.deleteIdea = (req, res) => {
  const { id } = req.params;
  const data = { status: 'deleted' };

  Idea.update(data, { where: { id } }).then(() => {
    return res.status(200).send({
      info: 'Idea status set to \'deleted\'!'
    });
  }).catch(err => {
    console.error('error deleting idea: ', err);
    return res.status(500).send({
      error: 'server error deleting idea',
      details: err
    });
  });
}
