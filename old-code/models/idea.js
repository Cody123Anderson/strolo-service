const Sequelize = require('sequelize');

const { sequelize } = require('../services/database');

const Idea = sequelize.define('Idea', {
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
      as: 'businessId'
    },
    allowNull: false
  },
  createdAt: { allowNull: false, type: Sequelize.DATE },
  updatedAt: { allowNull: false, type: Sequelize.DATE },
  title: { type: Sequelize.STRING, allowNull: false },
  description: { type: Sequelize.TEXT },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'under construction' // 'active', 'under construction', 'deactivated'
  },
  reservationRequired: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  reservationDetails: { type: Sequelize.TEXT },
  startDate: {
    allowNull: false,
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  endDate: { type: Sequelize.DATE },
  eventStartDate: { type: Sequelize.DATE },
  eventEndDate: { type: Sequelize.DATE }
});

module.exports = Idea;
