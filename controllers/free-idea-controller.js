const db = require('../services/database');
const config = require('../config');
const { formatFreeIdea } = require('../models/free-idea');
const { getUpdateExpression } = require('../utils/dynamo-expressions');
const { getTimestamp } = require('../utils/timestamp');
const uuid = require('../utils/uuid');

const identifier = 'fi';

exports.getAllFreeIdeas = (req, res, next) => {
  const args = { TableName: config.TABLE_FREE_IDEA };

  db.scan(args, (err, data) => {
    if (err) {
      console.error('Error in getAllFreeIdeas controller function: ', err);
      return res.status(500).send({ freeIdeas: null, error: err });
    }

    return res.status(200).send({ freeIdeas: data.Items });
  });
};

exports.getFreeIdeasForStatus = (req, res, next) => {
  const status = req.params.status;
  const args = {
    TableName: config.TABLE_FREE_IDEA,
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
      console.error('Error in getFreeIdeasForStatus controller function: ', err);
      return res.status(500).send({ freeIdeas: null, error: err });
    }

    return res.status(200).send({ freeIdeas: data.Items });
  });
}

exports.getFreeIdeasWithinRange = (req, res, next) => {
  return res.status(200).send({
    freeIdeas: {
      info: 'This endpoint hasn\'t been implemented yet!'
    }
  });
}

exports.getFreeIdea = (req, res, next) => {
  const id = req.params.id;
  const args = {
    TableName: config.TABLE_FREE_IDEA,
    Key: { id: id }
  }

  db.get(args, (err, data) => {
    if (err) {
      console.error('Error in getFreeIdea controller function: ', err);
      return res.status(500).send({ freeIdea: null, error: err });
    }

    return res.status(200).send({ freeIdea: data.Item });
  });
}

exports.createFreeIdea = (req, res, next) => {
  let freeIdea = formatFreeIdea(req.body);
  const timestamp = getTimestamp();

  freeIdea.id = uuid(identifier);
  freeIdea.creationDate = timestamp;
  freeIdea.lastUpdated = timestamp;

  console.log('freeIdea: ', JSON.stringify(freeIdea, null, 2));

  const args = {
    TableName: config.TABLE_FREE_IDEA,
    Item: freeIdea,
  };

  db.put(args, (err, data) => {
    if (err) {
      console.error('Error in createFreeIdea controller function: ', err);
      return res.status(500).send({ freeIdea: null, error: err });
    }

    return res.status(200).send({
      info: 'new freeIdea created successfully!',
      id: freeIdea.id
    });
  });
}

exports.updateFreeIdea = (req, res, next) => {
  const id = req.params.id;
  let args = {
    TableName: config.TABLE_FREE_IDEA,
    Key: { id: id }
  }

  db.get(args, (err, data) => {
    if (err) {
      console.error('Error in get part of updateFreeIdea controller function: ', err);
      return res.status(500).send({ freeIdea: null, error: err });
    }

    if (data.Item) {
      // Item exists, now update it
      const freeIdea = formatFreeIdea(req.body);
      freeIdea.lastUpdated = getTimestamp();
      const expression = getUpdateExpression(freeIdea);

      args = {
        TableName: config.TABLE_FREE_IDEA,
        Key: { id: id },
        UpdateExpression: expression.expressionString,
        ExpressionAttributeNames: expression.attributeNames,
        ExpressionAttributeValues: expression.attributeValues,
        ReturnValues: 'ALL_NEW'
      }

      db.update(args, (err, data) => {
        if (err) {
          console.error('Error in update part of updateFreeIdea controller function: ', err);
          return res.status(500).send({ freeIdea: null, error: err });
        }

        return res.status(200).send({ freeIdea: data.Attributes });
      });
    } else {
      // Item doesn't exist
      return res.status(404).send({ error: 'no item with this id exists'});
    }
  });
}

exports.deleteFreeIdea = (req, res, next) => {
  const id = req.params.id;
  const args = {
    TableName: config.TABLE_FREE_IDEA,
    Key: { id: id }
  }

  db.get(args, (err, data) => {
    if (err) {
      console.error('Error in get part of deleteFreeIdea controller function: ', err);
      return res.status(500).send({ freeIdea: null, error: err });
    }

    if (data.Item) {
      // Item exists, now delete it
      db.delete(args, (err, data) => {
        if (err) {
          console.error('Error in delete part of deleteFreeIdea controller function: ', err);
          return res.status(500).send({ freeIdea: null, error: err });
        }

        return res.status(200).send({ info: 'Successfully deleted freeIdea with ID ' + id });
      });
    } else {
      // Item doesn't exist
      return res.status(404).send({ error: 'no item with this id exists'});
    }
  });
}
