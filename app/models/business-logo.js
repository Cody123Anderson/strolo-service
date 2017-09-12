const Sequelize = require('sequelize');

const { sequelize } = require('../services/database');

const BusinessLogo = sequelize.define('BusinessLogo', {
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
  url: {
    type: Sequelize.STRING,
    allowNull: false
  },
  cloudinaryId: {
    type: Sequelize.STRING
  },
  width: {
    type: Sequelize.INTEGER,
  },
  height: {
    type: Sequelize.INTEGER,
  }
});

module.exports = BusinessLogo;
