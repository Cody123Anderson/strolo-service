let DB_NAME = 'dealtrixdb';
let DB_USERNAME = 'dealtrixadmin';
let DB_PASSWORD = 'Dealtrix2017.';
let DB_HOST = 'dealtrixmain.c4rhokpifkq1.us-west-1.rds.amazonaws.com';
let STRIPE_SECRET_KEY = 'sk_live_FtyFa5fFIvl5U1eYfVffdtUa';
let TABLE_ADMIN = 'Admin';

if (process.env.NODE_ENV === 'development') {
  DB_NAME = 'dealtrix_dev';
  DB_USERNAME = 'dealtrix';
  DB_PASSWORD = 'dealtrix';
  DB_HOST = '127.0.0.1';
  STRIPE_SECRET_KEY = 'sk_test_nGZ5IJisXAiljDuRg79tSug6';
  TABLE_ADMIN = 'AdminTest';
}

module.exports = {
  AWS_USERNAME: 'dealtrix-api',
  AWS_ACCESS_KEY_ID: 'AKIAIUAHQYH35QLMANYQ',
  AWS_SECRET_ACCESS_KEY: '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',
  AWS_REGION: 'us-west-1',
  CLOUDINARY_PUBLIC_NAME: 'dealtrix',
  CLOUDINARY_API_KEY: '722488893784524',
  CLOUDINARY_API_SECRET: 'dfIGzO-xhwcKVMOwOSflXBu7yoY',
  DB_IDENTIFIER: 'dealtrixmain',
  DB_NAME: DB_NAME,
  DB_USERNAME: DB_USERNAME,
  DB_PASSWORD: DB_PASSWORD,
  DB_HOST: DB_HOST,
  JWT_SECRET: 'aldj09230falkfj132013ifjldkfa',
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  SENDGRID_API_KEY: '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',
  SENDGRID_LIST_ID: 793453,
  STRIPE_SECRET_KEY: STRIPE_SECRET_KEY,
  TABLE_ADMIN: TABLE_ADMIN,
};
