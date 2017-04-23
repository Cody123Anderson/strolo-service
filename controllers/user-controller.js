const { newUser, formatUser } = require('../models/user');
const { encodeUserToken, decodeToken } = require('../utils/jwt-token');
const { getUpdateExpression } = require('../utils/dynamo-expressions');
const { comparePasswords } = require('../utils/password');
const db = require('../services/database');
const config = require('../config');

exports.isLoggedIn = (req, res) => {
  // User has already been logged in if they get here
  return res.status(200).send({
    loggedin: true
  });
};

exports.login = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const params = {
    TableName: config.TABLE_USER,
    Key: { email }
  };

  db.get(params, (err, data) => {
    if (err) {
      return res.status(500).send({
        error: 'unable to process server request in user checkCredentials'
      });
    }

    if (data.Item) {
      // User exists, check password
      const hashedPassword = data.Item.password;
      comparePasswords(password, hashedPassword, (err, isMatch) => {
        if (err) {
          return res.status(500).send({
            error: 'unable to process server request in user password comparison'
          });
        }

        if (isMatch) {
          // Valid email and password, give them a token
          res.status(200).send({
            token: encodeUserToken(data.Item)
          });
        } else {
          // incorrect password
          return res.status(422).send({
            error: 'incorrect email/password combination'
          });
        }
      });

    } else {
      return res.status(422).send({
        error: 'incorrect email/password combination'
      });
    }
  });
};

exports.signup = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send({
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
        error: 'Server Error scanning users: Please refresh the page and try again'
      });
    }

    // If a user with this email exists, return an error
    if (data.Count > 0) {
      return res.status(422).send({
        error: 'email is already in use'
      });
    }

    // Since no user with this email exists, create a new user
    newUser({ email, password }, (err, user) => {
      if (err) {
        console.error("Unable to create new user: ", JSON.stringify(err, null, 2));
        return res.status(500).send({
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
            error: 'Server Error creating user in db: Please refresh the page and try again'
          });
        } else {
          return res.status(200).send({
            info: 'new user created!',
            token: encodeUserToken(user)
          });
        }
      });

    });
  });
}

exports.update = (req, res) => {
  const token = req.headers.authorization;
  const decoded = decodeToken(token);
  const email = decoded.sub;
  const userFields = req.body;

  if (userFields.password) {
    return res.status(400).send({
      error: 'You can\'t update user email or password with this route'
    });
  }

  let args = {
    TableName: config.TABLE_USER,
    Key: { email }
  }

  db.get(args, (err, data) => {
    if (err) {
      console.error('Error in get part of updateFreeIdea controller function: ', err);
      return res.status(500).send({ freeIdea: null, error: err });
    }

    if (data.Item) {
      // User exists, now update it
      const updatedUser = formatUser(userFields);
      const expression = getUpdateExpression(updatedUser);
      const updateArgs = {
        TableName: config.TABLE_USER,
        Key: { email },
        UpdateExpression: expression.expressionString,
        ExpressionAttributeNames: expression.attributeNames,
        ExpressionAttributeValues: expression.attributeValues,
        ReturnValues: 'ALL_NEW'
      }

      db.update(updateArgs, (err, data) => {
        if (err) {
          console.error('Error in update part of update user controller function: ', err);
          return res.status(500).send({ error: err });
        }

        return res.status(200).send({ user: data.Attributes });
      });
    } else {
      // Item doesn't exist
      return res.status(404).send({ error: 'no user with this email exists'});
    }
  });
}
