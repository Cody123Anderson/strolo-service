const Sequelize = require('sequelize');

const { sequelize } = require('../services/database');

const BusinessContact = sequelize.define('BusinessContact', {
  id: {
    allowNull: false,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    type: Sequelize.UUID
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  position: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING,
    isEmail: true
  },
  phone: {
    type: Sequelize.STRING,
  }
});

module.exports = BusinessContact;
