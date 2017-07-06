const { cleanObj } = require('../utils/format-data');
const uuid = require('../utils/uuid');
const { getTimestamp } = require('../utils/timestamp');
const { getDetailedLocation } = require('../utils/location');

function newLocation(loc, cb) {
  formatLocation(loc, (err, formattedLocation) => {
    if (err) cb(err, null);

    const newLocation = {
      creationDate: getTimestamp(),
      id: uuid(),
    };
    const completeNewLocation = Object.assign(formattedLocation, newLocation);

    cb(null, completeNewLocation);
  });
}

function formatLocation(loc, cb) {
  const formattedLocation = {
    businessId: loc.businessId,
    lastUpdated: getTimestamp(),
    address: loc.address,
    address2: loc.address2,
    city: loc.city,
    state: loc.state,
    zipcode: loc.zipcode,
    country: loc.country,
    countryCode: loc.countryCode,
    latitude: loc.latitude,
    longitude: loc.longitude,
    phone: loc.phone
  };

  getDetailedLocation(formattedLocation, (err, loc) => {
    if (err) cb(err, null);

    formattedLocation.latitude = loc.latitude;
    formattedLocation.longitude = loc.longitude;
    formattedLocation.country = loc.country;
    formattedLocation.countryCode = loc.countryCode;

    // Remove null or undefined attributes
    cleanObj(formattedLocation);

    cb(null, formattedLocation);
  });
}

module.exports = { newLocation, formatLocation };
