const Sequelize = require('sequelize');

const { sequelize } = require('../services/database');
const { cleanObj } = require('../utils/format-data');
const { getDetailedLocation } = require('../utils/location');

const Location = sequelize.define('Location', {
  id: {
    allowNull: false,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    type: Sequelize.UUID
  },
  businessId: {
    type: Sequelize.UUID,
    onDelete: 'CASCADE',
    references: {
      model: 'Businesses',
      key: 'id',
      as: 'businessId',
    },
    allowNull: false
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE
  },
  address: {
    type: Sequelize.STRING,
    allowNull: false
  },
  address2: {
    type: Sequelize.STRING
  },
  city: {
    type: Sequelize.STRING,
    allowNull: false
  },
  state: {
    type: Sequelize.STRING,
    allowNull: false
  },
  zipcode: {
    type: Sequelize.STRING,
    allowNull: false
  },
  country: {
    type: Sequelize.STRING
  },
  countryCode: {
    type: Sequelize.STRING
  },
  latitude: {
    type: Sequelize.STRING,
    allowNull: false
  },
  longitude: {
    type: Sequelize.STRING,
    allowNull: false
  },
  phone: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  }
});

function formatLocation(loc, cb) {
  const formattedLocation = {
    businessId: loc.businessId,
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

module.exports = { Location, formatLocation };
