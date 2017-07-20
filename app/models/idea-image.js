const Sequelize = require('sequelize');

const { sequelize } = require('../services/database');

const IdeaImage = sequelize.define('IdeaImage', {
  id: {
    allowNull: false,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    type: Sequelize.UUID
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

module.exports = IdeaImage;
