import { DataTypes } from 'sequelize';

import { sequelize } from '../services/sequelize';

const User = sequelize.define('user', {
  userId: {
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
  },
  plusOneFirstName: {
    type: DataTypes.STRING
  }
}, {});

// User.associate = function(models) {
//   // associations can be defined here
// };

module.exports = User;
