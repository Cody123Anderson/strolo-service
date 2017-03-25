const { newUser } = require('../models/user');
const { encodeUserToken, decodeToken } = require('../utils/jwt-token');
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
  const email = req.body.email;
  const password = req.body.password;
  const params = {
    TableName: config.TABLE_USER,
    Key: { email: email }
  };

  db.get(params, (err, data) => {
    if (err) {
      return res.status(500).send({
        status: 500,
        error: 'unable to process server request in user checkCredentials'
      });
    }

    if (data.Item) {
      // User exists, check password
      const hashedPassword = data.Item.password;
      comparePasswords(password, hashedPassword, (err, isMatch) => {
        if (err) {
          return res.status(500).send({
            status: 500,
            error: 'unable to process server request in user password comparison'
          });
        }

        if (isMatch) {
          // Valid email and password, give them a token
          res.status(200).send({
            status: 200,
            token: encodeUserToken(data.Item)
          });
        } else {
          // incorrect password
          return res.status(422).send({
            status: 422,
            error: 'incorrect email/password combination'
          });
        }
      });

    } else {
      return res.status(422).send({
        status: 422,
        error: 'incorrect email/password combination'
      });
    }
  });
};

exports.signup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send({
      status: 422,
      error: 'You must provide email and password'
    });
  }

  // See if a user with given username already exists
  const params = {
    TableName: config.TABLE_USER,
    ProjectionExpression: '#email',
    FilterExpression: '#email = :email',
    ExpressionAttributeNames: {
      '#email': 'email'
    },
    ExpressionAttributeValues: {
      ':email': email
    }
  };

  db.scan(params, (err, data) => {
    if (err) {
      console.error('Error Scanning DB: ', err);
      return res.status(500).send({
        status: 500,
        error: 'Server Error scanning users: Please refresh the page and try again'
      });
    }

    // If a user with this email exists, return an error
    if (data.Count > 0) {
      return res.status(422).send({
        status: 422,
        error: 'email is already in use'
      });
    }

    // Since no user with this email exists, create a new user
    newUser({ email, password }, (err, user) => {
      if (err) {
        console.error("Unable to create new user: ", JSON.stringify(err, null, 2));
        return res.status(500).send({
          status: 500,
          error: 'Server Error creating user: Please refresh the page and try again'
        });
      }

      const createParams = {
        TableName: config.TABLE_USER,
        Item: user
      };

      db.put(createParams, (err, data) => {
        if (err) {
          console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
          return res.status(500).send({
            status: 500,
            error: 'Server Error creating user in db: Please refresh the page and try again'
          });
        } else {
          return res.status(200).send({
            status: 200,
            info: 'new user created!',
            token: encodeUserToken(user)
          });
        }
      });

    });
  });
}
