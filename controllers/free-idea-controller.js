const FreeIdea = require('../models/free-idea');

exports.getAllFreeIdeas = (req, res, next) => {
  FreeIdea.find((err, freeideas) => {
    if (err) {
      console.error('Error in getAllFreeIdeas controller function: ', err);
      return res.status(500).send({
        status: 500,
        data: null,
        error: err,
      });
    }

    return res.status(200).send({
      status: 200,
      data: {
        freeIdeas: freeideas
      }
    });
  });
};

exports.getFreeIdeasForStatus = (req, res, next) => {
  FreeIdea.find({ status: req.params.status }, (err, freeideas) => {
    if (err) {
      console.error('Error in getFreeIdeasForStatus controller function: ', err);
      return res.status(500).send({
        status: 500,
        data: null,
        error: err,
      });
    }

    return res.status(200).send({
      status: 200,
      data: {
        freeIdeas: freeideas
      }
    });
  });
}

exports.getFreeIdeasWithinRange = (req, res, next) => {
  return res.status(200).send({
    status: 200,
    data: {
      info: 'This endpoint hasn\'t been implemented yet!'
    }
  });
}

exports.postFreeIdea = (req, res, next) => {
  var newFreeIdea = new FreeIdea(req.body);

  newFreeIdea.save((err) => {
    if (err) {
      console.error('Error in postFreeIdea controller function: ', err);
      return res.status(500).send({
        status: 500,
        data: null,
        error: err,
      });
    }

    return res.status(200).send({
      status: 200,
      data: {
        freeIdea: newFreeIdea
      }
    });
  });
}

exports.putFreeIdea = (req, res, next) => {
  FreeIdea.findByIdAndUpdate(req.params.id, { $set: req.body}, (err, freeIdea) => {
    if (err) {
      console.error('Error in putFreeIdea controller function: ', err);
      return res.status(500).send({
        status: 500,
        data: null,
        error: err,
      });
    } else if (!freeIdea) {
      return res.status(404).send({
        status: 404,
        info: 'No freeIdea found with this id!'
      });
    }

    return res.status(200).send({
      status: 200,
      data: {
        freeIdea: freeIdea
      }
    });
  });
}

exports.deleteFreeIdea = (req, res, next) => {
  FreeIdea.findByIdAndRemove(req.params.id, (err, freeIdea) => {
    if (err) {
      console.error('Error in deleteFreeIdea controller function: ', err);
      return res.status(500).send({
        status: 500,
        data: null,
        error: err,
      });
    } else if (!freeIdea) {
      return res.status(404).send({
        status: 404,
        info: 'No freeIdea found with this id!'
      });
    }

    return res.status(200).send({
      info: 'Successfully deleted freeIdea with ID ' + req.params.id
    });
  });
}
