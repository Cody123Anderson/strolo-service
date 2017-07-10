const _ = require('lodash');

const config = require('../config');
const { getUpdateExpression, batchKeysFormat } = require('../utils/dynamo');
// const { formatBusiness, newBusiness } = require('../models/business');
const Business = require('../models/business');

module.exports.getAllBusinesses = (req, res) => {
  Business.findAll().then((businesses) => {
    // Sort the businesses alphabetically by name
    const sortedBusinesses = _.sortBy(businesses, ['name']);

    return res.status(200).send({ businesses: sortedBusinesses });
  }).catch(err => {
    console.error('error in getAllBusinesses controller: ', err);
    return res.status(500).send({
      error: 'unable to retrieve businesses'
    });
  });
};

module.exports.getBusiness = (req, res) => {
  const id = req.params.id;

  Business.findById(id).then(business => {
    return res.status(200).send({ business });
  }).catch(err => {
    console.error('Error in getBusiness controller: ', err);
    return res.status(500).send({
      error: 'unable to retrieve business'
    });
  })
};

module.exports.createBusiness = (req, res) => {
  const business = req.body;

  if (!business.name) {
    return res.status(422).send({
      error: 'You must provide a business name'
    });
  }

  Business.create(business).then(business => {
    return res.status(200).send({
      info: 'new business created!',
      business: business
    });
  }).catch(err => {
    console.error('error creating business: ', err);
    return res.status(500).send({
      error: 'server error creating business'
    });
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
