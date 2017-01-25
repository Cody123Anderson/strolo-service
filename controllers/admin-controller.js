const jwt = require('jwt-simple');

const Admin = require('../models/admin');
const config = require('../config')

function tokenForUser(user) {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const expiration = timestamp + (60 * 60 * 24 * 7); // 7 days

  return jwt.encode({
    sub: user.id,
    iat: timestamp,
    exp: expiration
  }, config.JWT_SECRET);
}

exports.isLoggedIn = (req, res, next) => {
  // User has already been logged in if they get here
  return res.status(200).send({
    status: 200,
    loggedin: true
  });
};

exports.login = (req, res, next) => {
  // Valid username and password, give them a token
  res.status(200).send({
    status: 200,
    token: tokenForUser(req.user)
  });
};

exports.signup = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(422).send({
      status: 422,
      error: 'You must provide username and password'
    });
  }

  // See if a user with given username already exists
  Admin.findOne({ username: username }, (err, existingAdmin) => {
    if (err) { return next(err); }

    // If a user with this username exists, return an error
    if (existingAdmin) {
      return res.status(422).send({
        status: 422,
        error: 'username is already in use'
      });
    }

    // If no user with this username exists, create a new user
    const admin = new Admin({
      username: username,
      password: password
    });

    admin.save((err) => {
      if (err) { return next(err); }

      // Respond to the request indicating the user was created successfully
      return res.status(200).send({
        status: 200,
        info: 'new admin created!',
        token: tokenForUser(admin)
      });
    });
  });
}
