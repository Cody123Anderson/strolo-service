const { getTimestamp } = require('../utils/timestamp');
const { encryptPassword } = require('../utils/password');
const { cleanObj } = require('../utils/format-data');
const uuid = require('../utils/uuid');

function newUser(user, cb) {
  encryptPassword(user.password, (err, hashedPassword) => {
    if (err) cb(err, null);

    const formattedUser = formatUser(user);
    const newUser = {
      creationDate: getTimestamp(),
      email: user.email,
      favorites: [],
      password: hashedPassword
    };

    const completeNewUser = Object.assign(formattedUser, newUser);

    cb(null, completeNewUser);
  });
}

function formatUser(user) {
  const newUser = {
    email: user.email,
    favorites: user.favorites,
    lastUpdated: getTimestamp()
  };

  // Remove null or undefined attributes
  cleanObj(newUser);

  return newUser;
}

module.exports = { newUser, formatUser };
