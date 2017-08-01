const db = require('../services/database');
const config = require('../config');
const { Location } = require('../models');
const { formatLocation } = require('../models/location');
const { getUpdateExpression } = require('../utils/dynamo');

module.exports.getLocation = (req, res) => {
  const id = req.params.id;

  Location.findById(id).then(location => {
    return res.status(200).send({ location });
  }).catch(err => {
    console.error('Error in getLocation controller: ', err);
    return res.status(500).send({
      error: 'unable to retrieve location',
      details: err.message
    });
  });
}

module.exports.getLocationsForBusiness = (req, res) => {
  const { businessId } = req.params;

  Location.findAll({
    where: { businessId }
  }).then(locations => {
    return res.status(200).send({ locations });
  }).catch(err => {
    console.error('Error in getLocationsForBusiness controller: ', err);
    return res.status(500).send({
      error: 'unable to retrieve locations',
      details: err.message
    });
  });
}

module.exports.createLocation = (req, res) => {
  formatLocation(req.body, (err, formattedLocation) => {
    if (err) {
      console.error('error creating location: ', err);
      return res.status(500).send({
        error: 'error creating location',
        details: err.message
      });
    }

    if (!formattedLocation.businessId) {
      return res.status(422).send({
        error: 'You must provide a businessId with a location'
      });
    }

    Location.create(formattedLocation).then(location => {
      return res.status(200).send({
        info: 'new location created!',
        location: location
      });
    }).catch(err => {
      console.error('error creating location: ', err);
      return res.status(500).send({
        error: 'server error creating location',
        details: err.message
      });
    });
  });
}

module.exports.updateLocation = (req, res) => {
  const id = req.params.id;

  Location.findById(id).then(location => {
    const completeNewLocation = Object.assign(location, req.body);

    formatLocation(completeNewLocation, (err, formattedLocation) => {
      if (err) {
        console.error('error updating location: ', err);
        res.status(500).send({
          error: 'unable to update location',
          details: err.message
        });
      }

      Location.update(formattedLocation, {
        where: { id }
      }).then(() => {
        return res.status(200).send({ info: 'location updated successfully!' });
      }).catch(err => {
        console.error('error updating businessContact: ', err);
        return res.status(500).send({ error: 'server error updating businessContact' });
      });
    });
  }).catch(err => {
    console.error('Error in updateLocation controller: ', err);
    return res.status(500).send({
      error: 'unable to update location',
      details: err.message
    });
  });
}

module.exports.deleteLocation = (req, res) => {
  const id = req.params.id;

  Location.destroy({ where: { id } }).then(() => {
    return res.status(200).send({ info: 'location was destroyed!' });
  }).catch(err => {
    console.error('error deleting location: ', err);
    return res.status(500).send({
      error: 'server error deleting location',
      details: err.message
    });
  });
}
