const { newAdmin } = require('../models/admin');
const { encodeToken, decodeToken } = require('../utils/jwt-token');
const { comparePasswords } = require('../utils/password');
const db = require('../services/database');
const config = require('../config');

exports.isLoggedIn = (req, res, next) => {
  // User has already been logged in if they get here
  return res.status(200).send({
    status: 200,
    loggedin: true
  });
};

exports.login = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const params = {
    TableName: config.TABLE_ADMIN,
    Key: { username: username }
  };

  db.get(params, function(err, data) {
    if (err) {
      return res.status(500).send({
        status: 500,
        error: 'unable to process server request in admin checkCredentials'
      });
    }

    if (data.Item) {
      // User exists, check password
      const hashedPassword = data.Item.password;
      comparePasswords(password, hashedPassword, (err, isMatch) => {
        if (err) {
          return res.status(500).send({
            status: 500,
            error: 'unable to process server request in admin password comparison'
          });
        }

        if (isMatch) {
          // Valid username and password, give them a token
          res.status(200).send({
            status: 200,
            token: encodeToken(data.Item)
          });
        } else {
          // incorrect password
          return res.status(422).send({
            status: 422,
            error: 'incorrect username/password combination'
          });
        }
      });

    } else {
      return res.status(422).send({
        status: 422,
        error: 'incorrect username/password combination'
      });
    }
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
  const params = {
    TableName: config.TABLE_ADMIN,
    ProjectionExpression: '#username',
    FilterExpression: '#username = :username',
    ExpressionAttributeNames: {
      '#username': 'username'
    },
    ExpressionAttributeValues: {
      ':username': username
    }
  };

  db.scan(params, (err, data) => {
    if (err) {
      console.error('Error Scanning DB: ', err);
      return res.status(500).send({
        status: 500,
        error: 'Server Error scanning admins: Please refresh the page and try again'
      });
    }

    // If a user with this username exists, return an error
    if (data.Count > 0) {
      return res.status(422).send({
        status: 422,
        error: 'username is already in use'
      });
    }

    // Since no user with this username exists, create a new user
    newAdmin({ username, password }, (err, admin) => {
      if (err) {
        console.error("Unable to create new admin: ", JSON.stringify(err, null, 2));
        return res.status(500).send({
          status: 500,
          error: 'Server Error creating admin: Please refresh the page and try again'
        });
      }

      const createParams = {
        TableName: config.TABLE_ADMIN,
        Item: admin
      };

      db.put(createParams, (err, data) => {
        if (err) {
          console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
          return res.status(500).send({
            status: 500,
            error: 'Server Error creating admin in db: Please refresh the page and try again'
          });
        } else {
          return res.status(200).send({
            status: 200,
            info: 'new admin created!',
            token: encodeToken(admin)
          });
        }
      });

    });
  });
}
