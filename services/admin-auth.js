const aws = require('aws-sdk');

const { decodeToken } = require('../utils/jwt-token');
const config = require('../config');

// Configure AWS
aws.config.update({
  accessKeyId: config.AWS_ACCESS_KEY_ID,
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY
});
aws.config.update({ region: 'us-west-1' });

// Get instance of the database
const db = new aws.DynamoDB.DocumentClient();

exports.checkCredentials = (req, res, next) => {
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
    console.log('data: ', data);
    if (data.Item) {
      console.log('I have an item!')
      next(data);
    } else {
      return res.status(404).send('unauthorized');
    }
  });
};

exports.isAuthenticatedAdmin = (req, res, next) => {
  const token = req.headers.authorization;
  const decoded = decodeToken(token);
  console.log('token: ', decoded);

  const params = {
    TableName: config.TABLE_ADMIN,
    Key: {
      'username': decoded.sub,
    }
  };

  db.get(params, function(err, data) {
    if (err) {
      return res.status(500).send({
        status: 500,
        error: 'unable to authenticate user making request'
      });
    }

    if (data.Item) {
      next();
    } else {
      return res.status(403).send('unauthorized');
    }
  });
};
