const aws = require('aws-sdk');
const Sequelize = require('sequelize');

const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST
} = require('../config')

/**
  * Set up DynamoDB
**/

// Configure AWS
aws.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY
});
aws.config.update({ region: AWS_REGION });

// Get instance of the database
const dynamo = new aws.DynamoDB.DocumentClient();

/**
  * Set up Postgres with Sequelize
**/

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  port: 5432,
  dialect: 'postgres'
});

sequelize
  .authenticate()
  .then(() => {
    console.info('Postgres connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = { dynamo, sequelize };
