import { DataTypes } from 'sequelize';

import { sequelize } from '../services/sequelize';
import { cleanObj } from '../utils/format-data';

const Sponsor = sequelize.define('sponsor', {
  sponsorId: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.STRING
  },
  createdByAthleteId: {
    allowNull: false,
    type: DataTypes.STRING
  },
  code: {
    allowNull: false,
    type: DataTypes.STRING
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  measurementUnits: {
    type: DataTypes.STRING
  },
  logoUrl: {
    type: DataTypes.STRING
  },
  maxDailyContribution: {
    type: DataTypes.DECIMAL
  },
  maxMonthlyContribution: {
    type: DataTypes.DECIMAL
  },
  maxYearlyContribution: {
    type: DataTypes.DECIMAL
  },
  dayStreak100Bonus: {
    type: DataTypes.DECIMAL
  },
  dayStreak365Bonus: {
    type: DataTypes.DECIMAL
  },
  status: {
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

function formatSponsor(sponsor) {
  const formattedSponsor = {
    sponsorId: sponsor.sponsorId,
    createdByAthleteId: sponsor.createdByAthleteId,
    code: sponsor.code,
    type: sponsor.type,
    name: sponsor.name,
    measurementUnits: sponsor.measurementUnits,
    logoUrl: sponsor.logoUrl,
    maxDailyContribution: sponsor.maxDailyContribution,
    maxMonthlyContribution: sponsor.maxMonthlyContribution,
    maxYearlyContribution: sponsor.maxYearlyContribution,
    dayStreak100Bonus: sponsor.dayStreak100Bonus,
    dayStreak365Bonus: sponsor.dayStreak365Bonus,
    status: sponsor.status,
    createdAt: sponsor.createdAt,
    updatedAt: sponsor.updatedAt,
    deletedAt: sponsor.deletedAt
  };

  // Remove null or undefined attributes
  cleanObj(formattedSponsor);

  return formattedSponsor;
}

module.exports = { Sponsor, formatSponsor };
