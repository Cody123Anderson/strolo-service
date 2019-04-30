const Sequelize = require('sequelize');

const { sequelize } = require('../services/database');

const BusinessUser = sequelize.define('BusinessUser', {
  businessId: {
    type: Sequelize.UUID,
    onDelete: 'CASCADE',
    references: {
      model: 'Businesses',
      key: 'id',
      as: 'businessId'
    },
    allowNull: false
  },
  userId: {
    type: Sequelize.UUID,
    onDelete: 'CASCADE',
    references: {
      model: 'Users',
      key: 'id',
      as: 'userId'
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
  }
});

module.exports = BusinessUser;
