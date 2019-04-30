module.exports = {
  API_URL: process.env.API_URL,
  AWS: {
    REGION: process.env.REGION || 'us-east-1'
  },
  DASHBOARD_URL: process.env.DASHBOARD_URL,
  JWT: {
    SECRET: process.env.JWT_SECRET,
    TYPES: {
      ADMIN: 'Admin',
      USER: 'User'
    }
  },
  POSTGRES_DB_HOST: process.env.POSTGRES_DB_HOST,
  POSTGRES_DB_NAME: process.env.POSTGRES_DB_NAME,
  POSTGRES_DB_USERNAME: process.env.POSTGRES_DB_USERNAME,
  POSTGRES_DB_PASSWORD: process.env.POSTGRES_DB_PASSWORD,
  SENDGRID: {
    API_KEY: process.env.SENDGRID_API_KEY,
    API_URL: 'https://api.sendgrid.com/v3',
    RESET_USER_PASSWORD_TEMPLATE_ID: '',
    NEW_MEMBER_TEMPLATE_ID: 'd-f2afba36310b4fa4964bfed43796bf13'
  },
  SERENADE_SERVICE_API_KEY: process.env.SERENADE_SERVICE_API_KEY,
  USER_STATUS: {
    ACTIVE: 'Active',
    DELETED: 'Deleted'
  },
  USER_TYPES: {
    ADMIN: 'Admin',
    USER: 'User'
  }
};
