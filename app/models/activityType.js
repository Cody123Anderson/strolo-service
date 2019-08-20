import { DataTypes } from 'sequelize';

import { sequelize } from '../services/sequelize';
import { cleanObj } from '../utils/format-data';

const ActivityType = sequelize.define('activitytype', {
  activityTypeId: {
    primaryKey: true,
    type: DataTypes.STRING
  },
  type: {
    allowNull: false,
    type: DataTypes.STRING
  },
  rewardsEffortLevel: {
    type: DataTypes.DECIMAL(2),
    allowNull: false
  },
  status: {
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

function formatActivityType(obj) {
  const formattedObj = {
    activityTypeId: obj.activityTypeId,
    type: obj.type,
    rewardsEffortLevel: obj.rewardsEffortLevel,
    status: obj.status,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
    deletedAt: obj.deletedAt
  };

  // Remove null or undefined attributes
  cleanObj(formattedObj);

  return formattedObj;
}

module.exports = { ActivityType, formatActivityType };
