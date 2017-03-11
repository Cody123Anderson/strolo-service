const bcrypt = require('bcrypt-nodejs');

// Encrypts password when signing up
exports.encryptPassword = (password, cb) => {
  const salt = 8;
  bcrypt.genSalt(salt, (err, salt) => {
    if (err) { cb(err, null); }

    bcrypt.hash(password, salt, null, (err, hashedPassword) => {
      cb(err, hashedPassword);
    });
  });
}

// Checks for password match when logging in
exports.comparePasswords = (candidatePassword, hashedPassword, cb) => {
  bcrypt.compare(candidatePassword, hashedPassword, (err, isMatch) => {
    if (err) return cb(err, null);

    cb(null, isMatch);
  });
};
