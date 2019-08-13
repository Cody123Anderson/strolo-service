import { DataTypes } from 'sequelize';

import { sequelize } from '../services/sequelize';
import { cleanObj } from '../utils/format-data';

const Sponsorship = sequelize.define('sponsorship', {
  sponsorId: {
    primaryKey: true,
    type: DataTypes.STRING
  },
  athleteId: {
    primaryKey: true,
    type: DataTypes.STRING
  },
  status: {
    allowNull: false,
    type: DataTypes.STRING
  },
  startDate: {
    allowNull: false,
    type: DataTypes.STRING
  },
  endDate: {
    type: DataTypes.STRING
  },
  approvedAt: {
    type: DataTypes.STRING
  },
  cancelledAt: {
    type: DataTypes.STRING
  },
  createdAt: {
    type: DataTypes.STRING,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: false
});

function formatSponsorship(sponsorship) {
  const formattedSponsorship = {
    sponsorId: sponsorship.sponsorId,
    athleteId: sponsorship.athleteId,
    status: sponsorship.status,
    startDate: sponsorship.startDate,
    endDate: sponsorship.endDate,
    approvedAt: sponsorship.approvedAt,
    cancelledAt: sponsorship.cancelledAt,
    createdAt: sponsorship.createdAt,
    updatedAt: sponsorship.updatedAt
  };

  // Remove null or undefined attributes
  cleanObj(formattedSponsorship);

  return formattedSponsorship;
}

module.exports = { Sponsorship, formatSponsorship };
