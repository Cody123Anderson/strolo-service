const db = require('../services/database');
const config = require('../config');
const { newIdea, formatIdea } = require('../models/idea');
const { getUpdateExpression } = require('../utils/dynamo');
const { getTimestamp } = require('../utils/timestamp');
const uuid = require('../utils/uuid');
const { shuffleArray } = require('../utils/shuffle');

exports.getAllIdeas = (req, res) => {
  const args = { TableName: config.TABLE_IDEA };

  db.scan(args, (err, data) => {
    if (err) {
      console.error('Error in getAllIdeas controller function: ', err);
      return res.status(500).send({ error: err });
    }

    // Randomly shuffle arrray so free ideas display in a different order for each request
    const shuffledIdeas = shuffleArray(data.Items);

    return res.status(200).send({ ideas: shuffledIdeas });
  });
};

exports.getIdeasForStatus = (req, res) => {
  const status = req.params.status;
  const args = {
    TableName: config.TABLE_IDEA,
    FilterExpression: '#stat = :status',
    ExpressionAttributeNames: {
      '#stat': 'status'
    },
    ExpressionAttributeValues: {
      ':status': status
    }
  };

  db.scan(args, (err, data) => {
    if (err) {
      console.error('Error in getIdeasForStatus controller function: ', err);
      return res.status(500).send({ ideas: null, error: err });
    }

    return res.status(200).send({ ideas: data.Items });
  });
}

exports.getIdeasWithinRange = (req, res) => {
  return res.status(200).send({
    ideas: {
      info: 'This endpoint hasn\'t been implemented yet!'
    }
  });
}

exports.getIdea = (req, res) => {
  const id = req.params.id;
  const args = {
    TableName: config.TABLE_IDEA,
    Key: { id: id }
  }

  db.get(args, (err, data) => {
    if (err) {
      console.error('Error in getIdea controller function: ', err);
      return res.status(500).send({ idea: null, error: err });
    }

    return res.status(200).send({ idea: data.Item });
  });
}

exports.createIdea = (req, res) => {
  const idea = newIdea(req.body);
  const args = {
    TableName: config.TABLE_IDEA,
    Item: idea,
  };

  db.put(args, (err, data) => {
    if (err) {
      console.error('Error in createIdea controller function: ', err);
      return res.status(500).send({ error: err });
    }

    return res.status(200).send({
      info: 'new idea created successfully!',
      idea: idea
    });
  });
}

exports.updateIdea = (req, res) => {
  const id = req.params.id;
  let args = {
    TableName: config.TABLE_IDEA,
    Key: { id }
  };

  db.get(args, (err, data) => {
    if (err) {
      console.error('Error in get part of updateIdea controller function: ', err);
      return res.status(500).send({ idea: null, error: err });
    }

    if (data.Item) {
      // Item exists, now update it
      const idea = formatIdea(req.body);
      idea.lastUpdated = getTimestamp();
      const expression = getUpdateExpression(idea);

      args = {
        TableName: config.TABLE_IDEA,
        Key: { id },
        UpdateExpression: expression.expressionString,
        ExpressionAttributeNames: expression.attributeNames,
        ExpressionAttributeValues: expression.attributeValues,
        ReturnValues: 'ALL_NEW'
      }

      db.update(args, (err, data) => {
        if (err) {
          console.error('Error in update part of updateIdea controller function: ', err);
          return res.status(500).send({ idea: null, error: err });
        }

        return res.status(200).send({
          info: 'idea updated successfully!',
          idea: data.Attributes
        });
      });
    } else {
      // Item doesn't exist
      return res.status(404).send({ error: 'no item with this id exists'});
    }
  });
}

exports.deleteIdea = (req, res) => {
  const id = req.params.id;
  const args = {
    TableName: config.TABLE_IDEA,
    Key: { id }
  };

  db.get(args, (err, data) => {
    if (err) {
      console.error('Error in get part of deleteIdea controller function: ', err);
      return res.status(500).send({ idea: null, error: err });
    }

    if (data.Item) {
      // Item exists, now delete it
      db.delete(args, (err, data) => {
        if (err) {
          console.error('Error in delete part of deleteIdea controller function: ', err);
          return res.status(500).send({ idea: null, error: err });
        }

        return res.status(200).send({ info: 'Successfully deleted idea with ID ' + id });
      });
    } else {
      // Item doesn't exist
      return res.status(404).send({ error: 'no item with this id exists'});
    }
  });
}
