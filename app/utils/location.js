const geocoder = require('../services/geocoder');

module.exports.getDetailedLocation = function(loc, cb) {
  const location = {
    address: loc.address,
    city: loc.city,
    state: loc.state,
    zipcode: loc.zipcode
  };

  geocoder.geocode(location)
    .then((res) => {
      cb(null, res[0]);
    })
    .catch((err) => {
      cb(err, null);
    });
}
