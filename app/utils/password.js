const bcrypt = require('bcryptjs');

// Encrypts password when signing up
exports.hashPassword = (password) => {
  return bcrypt.hashSync(password, 11);
};

// Checks for password match when logging in
exports.comparePasswords = (candidatePassword, hashedPassword, cb) => {
  bcrypt.compare(candidatePassword, hashedPassword, (err, isMatch) => {
    if (err) return cb(err, null);

    cb(null, isMatch);
  });
};