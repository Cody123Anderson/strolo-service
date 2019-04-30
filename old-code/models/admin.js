const getTimestamp = require('../app/utils/timestamp').getTimestamp;
const encryptPassword = require('../app/utils/password').encryptPassword;

function newAdmin(admin, cb) {
  encryptPassword(admin.password, (err, hashedPassword) => {
    if (err) cb(err, null);

    const newAdmin = {
      creationDate: getTimestamp(),
      username: admin.username,
      password: hashedPassword
    };

    cb(null, newAdmin);
  });
}

module.exports = { newAdmin };
