import { DataTypes } from 'sequelize';

import { sequelize } from '../services/sequelize';
import { cleanObj } from '../utils/format-data';

const StroloClass = sequelize.define('stroloClass', {
  stroloClassId: {
    primaryKey: true,
    type: DataTypes.STRING
  },
  activityTypeId: {
    foreignKey: true,
    type: DataTypes.STRING
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING
  },
  videoUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  videoImage: {
    type: DataTypes.STRING
  },
  instructorFirstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  instructorLastName: {
    type: DataTypes.STRING
  },
  length: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  difficultyLevel: {
    type: DataTypes.DECIMAL
  },
  goLiveAt: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.STRING,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.STRING,
    allowNull: false
  },
  deletedAt: {
    type: DataTypes.STRING
  }
}, {
  timestamps: false
});

function formatStroloClass(obj) {
  const formattedObj = {
    stroloClassId: obj.stroloClassId,
    activityTypeId: obj.activityTypeId,
    name: obj.name,
    videoUrl: obj.videoUrl,
    videoImage: obj.videoImage,
    instructorFirstName: obj.instructorFirstName,
    instructorLastName: obj.instructorLastName,
    length: obj.length,
    difficultyLevel: obj.difficultyLevel,
    goLiveAt: obj.goLiveAt,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
    deletedAt: obj.deletedAt
  };

  // Remove null or undefined attributes
  cleanObj(formattedObj);

  return formattedObj;
}

module.exports = { StroloClass, formatStroloClass };
