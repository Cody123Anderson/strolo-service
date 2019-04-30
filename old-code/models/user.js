import Sequelize from 'sequelize';

import { encryptPassword } from '../../old-code/app/utils/password';
import { cleanObj } from '../../old-code/app/utils/format-data';
import { sequelize } from '../services/database';

const User = sequelize.define('User', {
  userId: {
    allowNull: false,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    type: Sequelize.UUID
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE
  },
  deletedAt: {
    allowNull: true,
    type: Sequelize.DATE
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE
  },
  firstName: {
    type: Sequelize.STRING
  },
  lastName: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  passwordResetToken: {
    type: Sequelize.STRING
  },
  passwordResetExpiration: {
    type: Sequelize.DATE
  },
  phone: {
    type: Sequelize.STRING
  },
  birthday: {
    type: Sequelize.DATE
  },
  plusOneFirstName: {
    type: Sequelize.STRING
  }
});

function formatUser(user) {
  return new Promise((resolve, reject) => {
    if (user.password) {
      encryptPassword(user.password, (err, hashedPassword) => {
        if (err) reject(err);

        const formattedUser = {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: hashedPassword,
          phone: user.phone,
          birthday: user.birthday,
          plusOneFirstName: user.plusOneFirstName
        };

        // Remove null or undefined attributes
        cleanObj(formattedUser);

        resolve(formattedUser);
      });
    } else {
      const formattedUser = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        birthday: user.birthday,
        plusOneFirstName: user.plusOneFirstName
      };

      // Remove null or undefined attributes
      cleanObj(formattedUser);

      resolve(formattedUser);
    }
  });
}

module.exports = { User, formatUser };
