import Sequelize from 'sequelize';

import {
  POSTGRES_DB_NAME,
  POSTGRES_DB_USERNAME,
  POSTGRES_DB_PASSWORD,
  POSTGRES_DB_HOST
} from '../constants';

/**
  * Set up Postgres with Sequelize
**/

const sequelize = new Sequelize(
  POSTGRES_DB_NAME,
  POSTGRES_DB_USERNAME,
  POSTGRES_DB_PASSWORD,
  {
    host: POSTGRES_DB_HOST,
    port: 5432,
    dialect: 'postgres',
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.info('Postgres connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = { sequelize };
