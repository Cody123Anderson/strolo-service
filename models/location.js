const { cleanObj } = require('../utils/format-data');
const uuid = require('../utils/uuid');
const { getTimestamp } = require('../utils/timestamp');

function newLocation(loc) {
    const formattedLocation = formatLocation(loc);
    const newLocation = {
      creationDate: getTimestamp(),
      id: uuid('loc'),
    };
    const completeNewLocation = Object.assign(formattedLocation, newLocation);

    return completeNewLocation;
}

function formatLocation(loc) {
  const newLocation = {
    address: loc.address,
    address2: loc.address2,
    businessId: loc.businessId,
    city: loc.city,
    lastUpdated: getTimestamp(),
    latitude: loc.latitude,
    longitude: loc.longitude,
    state: loc.state,
    zip: loc.zip,
  };

  // Remove null or undefined attributes
  cleanObj(newLocation);

  return newLocation;
}

module.exports = { newLocation, formatLocation };
