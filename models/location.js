const cleanObj = require('../utils/clean-obj');
const uuid = require('../utils/uuid');
const { getTimestamp } = require('../utils/timestamp');

function newLocation(bus) {
    const currentTimestamp = getTimestamp();
    const newLocation = {
      address: loc.address,
      businessId: loc.businessId,
      city: loc.city,
      creationDate: currentTimestamp,
      id: uuid('loc'),
      lastUpdated: currentTimestamp,
      state: loc.state,
      zip: loc.zip,
    };

    // Remove null or undefined attributes
    cleanObj(newLocation);

    return newLocation;
}

function formatLocation(bus) {
  const newLocation = {
    address: loc.address,
    businessId: loc.businessId,
    city: loc.city,
    lastUpdated: getTimestamp(),
    state: loc.state,
    zip: loc.zip,
  };

  // Remove null or undefined attributes
  cleanObj(newLocation);

  return newLocation;
}

module.exports = { newLocation, formatLocation };
