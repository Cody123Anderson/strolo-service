const getTimestamp = require('../utils/timestamp').getTimestamp;
const encryptPassword = require('../utils/password').encryptPassword;

function newUser(user, cb) {
  encryptPassword(user.password, (err, hashedPassword) => {
    if (err) cb(err, null);

    const newUser = {
      creationDate: getTimestamp(),
      email: user.email,
      password: hashedPassword
    };

    cb(null, newUser);
  });
}

module.exports = { newUser };
