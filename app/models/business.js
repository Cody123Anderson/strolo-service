const Sequelize = require('sequelize');

const { sequelize } = require('../services/database');

const Business = sequelize.define('Business', {
  name: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: Sequelize.STRING,
    defaultValue: '',
  },
  billingAddress: {
    type: Sequelize.STRING
  },
  billingCity: {
    type: Sequelize.STRING
  },
  billingState: {
    type: Sequelize.STRING
  },
  billingZip: {
    type: Sequelize.STRING
  },
  website: {
    type: Sequelize.STRING,
    validate: {
      isUrl: true
    }
  },
  status: {
    type: Sequelize.STRING,
    defaultValue: 'active',
    validate: {
      notEmpty: true
    }
  },
  logo: {
    type: Sequelize.STRING,
    validate: {
      isUrl: true
    }
  },
});

module.exports = Business;
