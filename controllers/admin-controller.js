const jwt = require('jwt-simple');

const Admin = require('../models/admin');
const config = require('../config')

function tokenForUser(user) {
  const timestamp = new Date().getTime();

  return jwt.encode({ sub: user.id, iat: timestamp }, config.JWT_SECRET);
}

exports.isLoggedIn = (req, res, next) => {
  // User has already been logged in if they get here
  return res.status(200).send({ loggedin: true });
};

exports.login = (req, res, next) => {
  // Valid username and password, give them a token
  res.send({ token: tokenForUser(req.user) });
};

exports.signup = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(422).send({ error: 'You must provide username and password' });
  }

  // See if a user with given username already exists
  Admin.findOne({ username: username }, (err, existingAdmin) => {
    if (err) { return next(err); }

    // If a user with this username exists, return an error
    if (existingAdmin) {
      return res.status(422).send({ error: 'username is already in use' });
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
        success: 'new admin created!',
        token: tokenForUser(admin)
      });
    });
  });
}
