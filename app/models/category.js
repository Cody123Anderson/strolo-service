const Sequelize = require('sequelize');

const { sequelize } = require('../services/database');

const Category = sequelize.define('Category', {
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
  }
});

module.exports = Category;
