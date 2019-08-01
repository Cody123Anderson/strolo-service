import { DataTypes } from 'sequelize';

import { sequelize } from '../services/sequelize';

const Athlete = sequelize.define('athlete', {
  athleteId: {
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    type: DataTypes.UUID
  },
  deletedAt: {
    type: DataTypes.DATE
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
    type: DataTypes.DATE
  },
  gender: {
    type: DataTypes.STRING
  },
  measurementUnits: {
    type: DataTypes.STRING
  },
  birthday: {
    type: DataTypes.DATE
  },
  status: {
    type: DataTypes.STRING
  }
}, {});

// Athlete.associate = function(models) {
//   // associations can be defined here
// };

module.exports = Athlete;
