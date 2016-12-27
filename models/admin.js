const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

// Define admin model
const adminSchema = mongoose.Schema({
  creation_date: Date,
  username: { type: String, unique: true, lowercase: true },
  password: String
});

// On save hook, encrypt password
adminSchema.pre('save', function(next) {
  const admin = this;

  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }

    bcrypt.hash(admin.password, salt, null, (err, hash) => {
      if (err) { return next(err); }
      admin.password = hash;
      next();
    });
  });
});

// Checks for password match when logging in
adminSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) { return cb(err); }

    cb(null, isMatch);
  });
};

// create the model for users and expose it to our app
module.exports = mongoose.model('Admin', adminSchema);
