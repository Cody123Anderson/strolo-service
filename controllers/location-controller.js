const db = require('../services/database');
const config = require('../config');
const { newLocation, formatLocation } = require('../models/location');
const { getUpdateExpression } = require('../utils/dynamo');

module.exports.getAllLocations = (req, res) => {
  const args = {
    TableName: config.TABLE_LOCATION
  };

  db.scan(args, (err, data) => {
    if (err) {
      console.error('Error in getAllLocations controller: ', err);
      return res.status(500).send({
        error: 'server error getting locations'
      });
    }

    return res.status(200).send({ locations: data.Items });
  });
}

module.exports.getLocation = (req, res) => {
  const id = req.params.id;
  const args = {
    TableName: config.TABLE_LOCATION,
    Key: { id }
  };

  db.get(args, (err, data) => {
    if (err) {
      console.error('Error in getLocation controller function: ', err);
      return res.status(500).send({ error: 'server error getting location' });
    }

    return res.status(200).send({ location: data.Item });
  });
}

module.exports.createLocation = (req, res) => {
  let location = newLocation(req.body);

  if (!location.businessId) {
    return res.status(422).send({
      error: 'You must provide a businessId with a location'
    });
  }

  // Check to make sure business exists
  const getArgs = {
    TableName: config.TABLE_BUSINESS,
    Key: { id: location.businessId }
  };

  db.get(getArgs, (err, data) => {
    if (err) {
      console.error('Error checking if business exists: ', err);
      return res.status(500).send({ error: 'server error creating location' });
    }

    if (data.Item) {
      // Good to create the location
      const putArgs = {
        TableName: config.TABLE_LOCATION,
        Item: location
      };

      db.put(putArgs, (err, data) => {
        if (err) {
          console.error("Error adding location: ", err);
          return res.status(500).send({
            error: 'Server Error saving location: Please refresh the page and try again'
          });
        } else {
          return res.status(200).send({
            info: 'new location created!',
            location: location
          });
        }
      });
    } else {
      // Business doesn't exist
      return res.status(404).send({ error: 'no business with the given id exists' });
    }
  });
}

module.exports.updateLocation = (req, res) => {
  const id = req.params.id;
  const getArgs = {
    TableName: config.TABLE_LOCATION,
    Key: { id }
  };

  db.get(getArgs, (err, data) => {
    if (err) {
      console.error('Error in get part of updateLocation controller function: ', err);
      return res.status(500).send({ error: 'server error updating location' });
    }

    if (data.Item) {
      // Item exists, now update it
      const location = formatLocation(req.body);
      const expression = getUpdateExpression(location);

      const updateArgs = {
        TableName: config.TABLE_LOCATION,
        Key: { id },
        UpdateExpression: expression.expressionString,
        ExpressionAttributeNames: expression.attributeNames,
        ExpressionAttributeValues: expression.attributeValues,
        ReturnValues: 'ALL_NEW'
      }

      db.update(updateArgs, (err, data) => {
        if (err) {
          console.error('Error in update part of updateLocation controller function: ', err);
          return res.status(500).send({ error: 'server error updating location' });
        }

        return res.status(200).send({
          info: 'Location updated successfully!',
          location: data.Attributes
        });
      });
    } else {
      // Item doesn't exist
      return res.status(404).send({ error: 'no location with this id exists' });
    }
  });
}

module.exports.deleteLocation = (req, res) => {
  const id = req.params.id;
  const args = {
    TableName: config.TABLE_LOCATION,
    Key: { id }
  };

  db.get(args, (err, data) => {
    if (err) {
      console.error('Error in get part of deleteLocation controller function: ', err);
      return res.status(500).send({ error: 'server error deleting location' });
    }

    if (data.Item) {
      // Item exists, now delete it
      db.delete(args, (err, data) => {
        if (err) {
          console.error('Error in delete part of deleteLocation controller function: ', err);
          return res.status(500).send({ error: 'server error deleting location' });
        }

        return res.status(200).send({ info: 'Successfully deleted location with ID ' + id });
      });
    } else {
      // Item doesn't exist
      return res.status(404).send({ error: 'no location with this id exists'});
    }
  });
}
