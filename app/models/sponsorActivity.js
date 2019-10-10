import { DataTypes } from 'sequelize';

import { sequelize } from '../services/sequelize';
import { cleanObj } from '../utils/format-data';

const SponsorActivity = sequelize.define('sponsorship', {
  sponsorId: {
    primaryKey: true,
    type: DataTypes.STRING
  },
  activityId: {
    primaryKey: true,
    type: DataTypes.STRING
  }
}, {
  timestamps: false
});

function formatSponsorActivity(obj) {
  const formattedObj = {
    sponsorId: obj.sponsorId,
    activityId: obj.activityId
  };

  // Remove null or undefined attributes
  cleanObj(formattedObj);

  return formattedObj;
}

module.exports = { SponsorActivity, formatSponsorActivity };
