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
    allowNull: true,
    type: DataTypes.DATE
  },
  firstName: {
    type: DataTypes.STRING
  },
  lastName: {
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
  phone: {
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
