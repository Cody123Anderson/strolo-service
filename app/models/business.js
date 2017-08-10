const Sequelize = require('sequelize');

const { sequelize } = require('../services/database');

const Business = sequelize.define('Business', {
  id: {
    allowNull: false,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    type: Sequelize.UUID
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'Active'
  },
  websiteUrl: {
    type: Sequelize.STRING,
    isUrl: true
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
  stripeToken: {
    type: Sequelize.STRING
  },
  logoUrl: {
    type: Sequelize.STRING,
    isUrl: true
  }
});

module.exports = Business;
