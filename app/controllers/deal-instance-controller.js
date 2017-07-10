const db = require('../services/database');
const config = require('../config');
const { newDeal, formatDeal } = require('../models/deal');
const { getUpdateExpression } = require('../utils/dynamo');

module.exports.getAllDealInstances = (req, res) => {
  const args = {
    TableName: config.TABLE_DEAL
  };

  db.scan(args, (err, data) => {
    if (err) {
      console.error('Error in getAllDeals controller: ', err);
      return res.status(500).send({
        error: 'server error getting deals'
      });
    }

    return res.status(200).send({ deals: data.Items });
  });
}

module.exports.getDealInstance = (req, res) => {
  const id = req.params.id;
  const args = {
    TableName: config.TABLE_DEAL,
    Key: { id }
  };

  db.get(args, (err, data) => {
    if (err) {
      console.error('Error in getDeal controller function: ', err);
      return res.status(500).send({ error: 'server error getting deal' });
    }

    return res.status(200).send({ deal: data.Item });
  });
}

module.exports.createDealInstance = (req, res) => {
  let deal = newDeal(req.body);

  if (!deal.businessId) {
    return res.status(422).send({
      error: 'You must provide a businessId with a deal'
    });
  }

  // Check to make sure business exists
  const getArgs = {
    TableName: config.TABLE_BUSINESS,
    Key: { id: deal.businessId }
  };

  db.get(getArgs, (err, data) => {
    if (err) {
      console.error('Error checking if business exists: ', err);
      return res.status(500).send({ error: 'server error creating deal' });
    }

    if (data.Item) {
      // Good to create the deal
      const putArgs = {
        TableName: config.TABLE_DEAL,
        Item: deal
      };

      db.put(putArgs, (err, data) => {
        if (err) {
          console.error("Error adding deal: ", err);
          return res.status(500).send({
            error: 'Server Error saving deal: Please refresh the page and try again'
          });
        } else {
          return res.status(200).send({
            info: 'new deal created!',
            deal: deal
          });
        }
      });
    } else {
      // Business doesn't exist
      return res.status(404).send({ error: 'no business with the given id exists' });
    }
  });
}

module.exports.updateDealInstance = (req, res) => {
  const id = req.params.id;
  const getArgs = {
    TableName: config.TABLE_DEAL,
    Key: { id }
  };

  db.get(getArgs, (err, data) => {
    if (err) {
      console.error('Error in get part of updateDeal controller function: ', err);
      return res.status(500).send({ error: 'server error updating deal' });
    }

    if (data.Item) {
      // Item exists, now update it
      const deal = formatDeal(req.body);
      const expression = getUpdateExpression(deal);

      const updateArgs = {
        TableName: config.TABLE_DEAL,
        Key: { id },
        UpdateExpression: expression.expressionString,
        ExpressionAttributeNames: expression.attributeNames,
        ExpressionAttributeValues: expression.attributeValues,
        ReturnValues: 'ALL_NEW'
      }

      db.update(updateArgs, (err, data) => {
        if (err) {
          console.error('Error in update part of updateDeal controller function: ', err);
          return res.status(500).send({ error: 'server error updating deal' });
        }

        return res.status(200).send({
          info: 'Deal updated successfully!',
          deal: data.Attributes
        });
      });
    } else {
      // Item doesn't exist
      return res.status(404).send({ error: 'no deal with this id exists' });
    }
  });
}

module.exports.deleteDealInstance = (req, res) => {
  const id = req.params.id;
  const getArgs = {
    TableName: config.TABLE_DEAL,
    Key: { id }
  }

  db.get(getArgs, (err, data) => {
    if (err) {
      console.error('Error in get part of deleteDeal controller: ', err);
      return res.status(500).send({ error: err });
    }

    if (data.Item) {
      if (data.Item.status === 'deleted') {
        // Already has deleted status
        return res.status(200).send({
          info: 'Deal status is already \'deleted\'!',
        });
      }

      // Update deal status to 'deleted'
      const deal = formatDeal({ status: 'deleted' });
      const expression = getUpdateExpression(deal);
      const updateArgs = {
        TableName: config.TABLE_DEAL,
        Key: { id },
        UpdateExpression: expression.expressionString,
        ExpressionAttributeNames: expression.attributeNames,
        ExpressionAttributeValues: expression.attributeValues,
        ReturnValues: 'ALL_NEW'
      }

      db.update(updateArgs, (err, data) => {
        if (err) {
          console.error('Error in update part of deleteDeal controller: ', err);
          return res.status(500).send({ error: err });
        }

        return res.status(200).send({
          info: 'Deal status set to \'deleted\'!',
        });
      });
    } else {
      // Item doesn't exist
      return res.status(404).send({ error: 'no deal with this id exists'});
    }
  });
};
