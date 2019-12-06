const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'google'
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
