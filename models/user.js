const { getTimestamp } = require('../utils/timestamp');
const { encryptPassword } = require('../utils/password');
const cleanObj = require('../utils/clean-obj');

function newUser(user, cb) {
  encryptPassword(user.password, (err, hashedPassword) => {
    if (err) cb(err, null);

    const currentTimestamp = getTimestamp();

    const newUser = {
      creationDate: currentTimestamp,
      email: user.email,
      favorites: [],
      lastUpdated: currentTimestamp,
      password: hashedPassword
    };

    cb(null, newUser);
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
