const aws = require('aws-sdk');

const config = require('../config')

// Configure AWS
aws.config.update({
  accessKeyId: config.AWS_ACCESS_KEY_ID,
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY
});
aws.config.update({ region: config.AWS_REGION });

// Get instance of the database
const db = new aws.DynamoDB.DocumentClient();

module.exports = db;
