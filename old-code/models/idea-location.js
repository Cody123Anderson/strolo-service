const Sequelize = require('sequelize');

const { sequelize } = require('../services/database');

const IdeaLocation = sequelize.define('IdeaLocation', {
  ideaId: {
    type: Sequelize.UUID,
    onDelete: 'CASCADE',
    references: {
      model: 'Ideas',
      key: 'id',
      as: 'ideaId'
    },
    allowNull: false
  },
  locationId: {
    type: Sequelize.UUID,
    onDelete: 'CASCADE',
    references: {
      model: 'Locations',
      key: 'id',
      as: 'locationId'
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

module.exports = IdeaLocation;
