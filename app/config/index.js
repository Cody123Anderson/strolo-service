let DB_NAME = 'dealtrix-prod';
let DB_USERNAME = 'dealtrix';
let DB_PASSWORD = 'Dealtrix2017.';
let DB_HOST = '';
let STRIPE_SECRET_KEY = 'sk_live_FtyFa5fFIvl5U1eYfVffdtUa';
let TABLE_ADMIN = 'Admin';
let TABLE_FREE_IDEA = 'FreeIdea';
let TABLE_USER = 'User';

if (process.env.NODE_ENV === 'development') {
  DB_NAME = 'dealtrix_dev';
  DB_USERNAME = 'dealtrix';
  DB_PASSWORD = 'dealtrix';
  DB_HOST = '127.0.0.1';
  STRIPE_SECRET_KEY = 'sk_test_nGZ5IJisXAiljDuRg79tSug6';
  TABLE_ADMIN = 'TestAdmin';
  TABLE_FREE_IDEA = 'TestFreeIdea';
  TABLE_USER = 'TestUser';
}

module.exports = {
  AWS_USERNAME: 'serenade-api',
  AWS_ACCESS_KEY_ID: 'AKIAIXX7RVLTRPTISLEA',
  AWS_SECRET_ACCESS_KEY: '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',
  AWS_REGION: 'us-west-1',
  CLOUDINARY_PUBLIC_NAME: 'serenade-dates',
  CLOUDINARY_API_KEY: '971751553556737',
  CLOUDINARY_API_SECRET: 'rwREfpnfaDaHhz5QuzO6ptEOoGw',
  DB_NAME: DB_NAME,
  DB_USERNAME: DB_USERNAME,
  DB_PASSWORD: DB_PASSWORD,
  JWT_SECRET: 'aldj09230falkfj132013ifjldkfa',
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  SENDGRID_API_KEY: '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',
  SENDGRID_LIST_ID: 793453,
  STRIPE_SECRET_KEY: STRIPE_SECRET_KEY,
  TABLE_ADMIN: TABLE_ADMIN,
  TABLE_FREE_IDEA: TABLE_FREE_IDEA,
  TABLE_USER: TABLE_USER
};
