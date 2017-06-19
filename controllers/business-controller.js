const _ = require('lodash');

const db = require('../services/database');
const config = require('../config');
const { getUpdateExpression, batchKeysFormat } = require('../utils/dynamo');
const { formatBusiness, newBusiness } = require('../models/business');

module.exports.getAllBusinesses = (req, res) => {
  const args = {
    TableName: config.TABLE_BUSINESS
  };

  db.scan(args, (err, data) => {
    if (err) {
      console.error('Error in getAllBusinesses controller: ', err);
      return res.status(500).send({
        error: 'server error getting businesses'
      });
    }

    // Sort the businesses alphabetically by name
    const sortedBusinesses = _.sortBy(data.Items, ['name']);

    return res.status(200).send({ businesses: sortedBusinesses });
  });
};

module.exports.getBusiness = (req, res) => {
  const id = req.params.id;

  const args = {
    TableName: config.TABLE_BUSINESS,
    Key: { id }
  };

  db.get(args, (err, data) => {
    if (err) {
      console.error('Error getting business: ', err);
      return res.status(500).send({
        error: 'unable to retrieve business'
      });
    }

    if (data.Item) {
      let business = data.Item;
        // Add all locations to business response object
        var scanParams = {
          'TableName': config.TABLE_LOCATION,
          // 'AttributesToGet': ['ID','COMMENTS','DATE'],
          'FilterExpression': 'businessId = :busId',
          'ExpressionAttributeValues': {
            ':busId': business.id
          }
        }

        db.scan(scanParams, (err, data) => {
          if (err) {
            console.error('error scanning locations in getBusiness function: ', err);
            return res.status(500).send({
              error: 'unable to process server request'
            });
          }

          business.locations = data.Items;

          return res.status(200).send({ business });
        });
    } else {
      return res.status(404).send({
        error: 'No business found with this id'
      });
    }
  });
};

module.exports.createBusiness = (req, res) => {
  let business = newBusiness(req.body);

  if (!business.name) {
    return res.status(422).send({
      error: 'You must provide a business name'
    });
  }

  const args = {
    TableName: config.TABLE_BUSINESS,
    Item: business
  };

  db.put(args, (err, data) => {
    if (err) {
      console.error("Error adding business: ", err);
      return res.status(500).send({
        error: 'Server Error saving business: Please refresh the page and try again'
      });
    } else {
      return res.status(200).send({
        info: 'new business created!',
        business: business
      });
    }
  });
};

module.exports.updateBusiness = (req, res) => {
  const id = req.params.id;
  const getArgs = {
    TableName: config.TABLE_BUSINESS,
    Key: { id }
  }

  db.get(getArgs, (err, data) => {
    if (err) {
      console.error('Error in get part of updateBusiness controller: ', err);
      return res.status(500).send({ error: err });
    }

    if (data.Item) {
      // Item exists, now update it
      const business = formatBusiness(req.body);
      const expression = getUpdateExpression(business);
      const updateArgs = {
        TableName: config.TABLE_BUSINESS,
        Key: { id },
        UpdateExpression: expression.expressionString,
        ExpressionAttributeNames: expression.attributeNames,
        ExpressionAttributeValues: expression.attributeValues,
        ReturnValues: 'ALL_NEW'
      }

      db.update(updateArgs, (err, data) => {
        if (err) {
          console.error('Error in update part of updateBusiness controller: ', err);
          return res.status(500).send({ error: err });
        }

        return res.status(200).send({
          info: 'Business updated successfully!',
          business: data.Attributes
        });
      });
    } else {
      // Item doesn't exist
      return res.status(404).send({ error: 'no business with this id exists'});
    }
  });
};

module.exports.deleteBusiness = (req, res) => {
  const id = req.params.id;
  const getArgs = {
    TableName: config.TABLE_BUSINESS,
    Key: { id }
  }

  db.get(getArgs, (err, data) => {
    if (err) {
      console.error('Error in get part of deleteBusiness controller: ', err);
      return res.status(500).send({ error: err });
    }

    if (data.Item) {
      if (data.Item.status === 'deleted') {
        // Already has deleted status
        return res.status(200).send({
          info: 'Business status is already \'deleted\'!',
        });
      }

      // Update business status to 'deleted'
      const business = formatBusiness({ status: 'deleted' });
      const expression = getUpdateExpression(business);
      const updateArgs = {
        TableName: config.TABLE_BUSINESS,
        Key: { id },
        UpdateExpression: expression.expressionString,
        ExpressionAttributeNames: expression.attributeNames,
        ExpressionAttributeValues: expression.attributeValues,
        ReturnValues: 'ALL_NEW'
      }

      db.update(updateArgs, (err, data) => {
        if (err) {
          console.error('Error in update part of deleteBusiness controller: ', err);
          return res.status(500).send({ error: err });
        }

        return res.status(200).send({
          info: 'Business status set to \'deleted\'!',
        });
      });
    } else {
      // Item doesn't exist
      return res.status(404).send({ error: 'no business with this id exists'});
    }
  });
};
