const passport = require('passport');
const jwtStrategy = require('passport-jwt').Strategy;
const extractJwt = require('passport-jwt').ExtractJwt;
const localStrategy = require('passport-local');

const Admin = require('../models/admin');
const config = require('../config');

// Create local strategy
const localOptions = { usernameField: 'username' };
const localLogin = new localStrategy(localOptions, (username, password, done) => {
  // Verify this username and password, call done with the user if valid
  Admin.findOne({ username: username }, (err, admin) => {
    if (err) { return done(err); }
    if (!admin) { return done(null, false); }

    // Compare passwords
    admin.comparePassword(password, (err, isMatch) => {
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false); }

      return done(null, admin);
    });
  });
});

// Set up options for JWT strategy
const jwtOptions = {
  jwtFromRequest: extractJwt.fromHeader('authorization'),
  secretOrKey: config.JWT_SECRET
};

// Create JWT strategy
const jwtLogin = new jwtStrategy(jwtOptions, (payload, done) => {
  // See if the user id in the payload exists in our database
  Admin.findById(payload.sub, (err, admin) => {
    if (err) { return done(err, false); }

    // If user exists, call 'done' with that user, otherwise return false for the user field
    if (admin) {
      done(null, admin);
    } else {
      done(null, false);
    }
  });
});

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
