const Sequelize = require('sequelize');

const { sequelize } = require('../services/database');

const UserFavorite = sequelize.define('UserFavorite', {
  userId: {
    type: Sequelize.UUID,
    onDelete: 'CASCADE',
    references: {
      model: 'Users',
      key: 'id',
      as: 'userId',
    },
    allowNull: false
  },
  ideaId: {
    type: Sequelize.UUID,
    onDelete: 'CASCADE',
    references: {
      model: 'Ideas',
      key: 'id',
      as: 'ideaId',
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

module.exports = UserFavorite;
