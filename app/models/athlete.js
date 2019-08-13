import { DataTypes } from 'sequelize';

import { sequelize } from '../services/sequelize';
import { cleanObj } from '../utils/format-data';

const Athlete = sequelize.define('athlete', {
  athleteId: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.STRING
  },
  firstName: {
    type: DataTypes.STRING
  },
  lastName: {
    type: DataTypes.STRING
  },
  profileImageUrl: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  username: {
    type: DataTypes.STRING,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  passwordResetToken: {
    type: DataTypes.STRING
  },
  passwordResetExpiration: {
    type: DataTypes.STRING
  },
  gender: {
    type: DataTypes.STRING
  },
  measurementUnits: {
    type: DataTypes.STRING
  },
  birthday: {
    type: DataTypes.STRING
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

function formatAthlete(athlete) {
  const formattedAthlete = {
    athleteId: athlete.athleteId,
    firstName: athlete.firstName,
    lastName: athlete.lastName,
    profileImageUrl: athlete.profileImageUrl,
    email: athlete.email,
    emailVerified: athlete.emailVerified,
    username: athlete.username,
    password: athlete.password,
    passwordResetToken: athlete.passwordResetToken,
    passwordResetExpiration: athlete.passwordResetExpiration,
    gender: athlete.gender,
    measurementUnits: athlete.measurementUnits,
    birthday: athlete.birthday,
    status: athlete.status,
    createdAt: athlete.createdAt,
    updatedAt: athlete.updatedAt,
    deletedAt: athlete.deletedAt
  };

  // Remove null or undefined attributes
  cleanObj(formattedAthlete);

  return formattedAthlete;
}

module.exports = { Athlete, formatAthlete };
