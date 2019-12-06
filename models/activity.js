import { DataTypes } from 'sequelize';

import { sequelize } from '../services/sequelize';
import { cleanObj } from '../utils/format-data';

const Activity = sequelize.define('activity', {
  activityId: {
    primaryKey: true,
    type: DataTypes.STRING
  },
  activityTypeId: {
    foreignKey: true,
    type: DataTypes.STRING
  },
  athleteId: {
    foreignKey: true,
    type: DataTypes.STRING
  },
  status: {
    allowNull: false,
    type: DataTypes.STRING
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING
  },
  source: {
    type: DataTypes.STRING,
    allowNull: false
  },
  inputMethod: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sourceActivityId: {
    type: DataTypes.STRING
  },
  startTime: {
    type: DataTypes.STRING
  },
  endTime: {
    type: DataTypes.STRING
  },
  durationSeconds: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  distance: {
    type: DataTypes.DECIMAL
  },
  measurementUnits: {
    type: DataTypes.STRING
  },
  elevationGained: {
    type: DataTypes.STRING
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

function formatActivity(obj) {
  const formattedObj = {
    activityId: obj.activityId,
    activityTypeId: obj.activityTypeId,
    athleteId: obj.athleteId,
    status: obj.status,
    name: obj.name,
    source: obj.source,
    inputMethod: obj.inputMethod,
    sourceActivityId: obj.sourceActivityId,
    startTime: obj.startTime,
    endTime: obj.endTime,
    durationSeconds: obj.durationSeconds,
    distance: obj.distance,
    measurementUnits: obj.measurementUnits,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
    deletedAt: obj.deletedAt
  };

  // Remove null or undefined attributes
  cleanObj(formattedObj);

  return formattedObj;
}

module.exports = { Activity, formatActivity };
