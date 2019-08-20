module.exports = {
  ACTIVITY_STATUS: {
    APPROVED: 'Approved',
    DELETED: 'Deleted'
  },
  ACTIVITY_TYPE_STATUS: {
    ACTIVE: 'Active',
    DELETED: 'Deleted'
  },
  API_URL: process.env.API_URL,
  AWS: {
    REGION: process.env.REGION || 'us-east-1'
  },
  DASHBOARD_URL: process.env.DASHBOARD_URL,
  JWT: {
    SECRET: process.env.JWT_SECRET,
    TYPES: {
      SPONSOR_ADMIN: 'Sponsor Admin',
      STROLO_ADMIN: 'Admin',
      ATHLETE: 'Athlete'
    }
  },
  MEASUREMENT_UNITS: {
    IMPERIAL: 'Imperial',
    METRIC: 'Metric'
  },
  POSTGRES_DB_HOST: process.env.POSTGRES_DB_HOST,
  POSTGRES_DB_NAME: process.env.POSTGRES_DB_NAME,
  POSTGRES_DB_USERNAME: process.env.POSTGRES_DB_USERNAME,
  POSTGRES_DB_PASSWORD: process.env.POSTGRES_DB_PASSWORD,
  SENDGRID: {
    API_KEY: process.env.SENDGRID_API_KEY,
    API_URL: 'https://api.sendgrid.com/v3',
    WELCOME_ATHLETE_TEMPLATE_ID: ''
  },
  STROLO_SERVICE_API_KEY: process.env.STROLO_SERVICE_API_KEY,
  SNS_TOPIC_ARNS: {},
  SPONSOR_STATUS: {
    ACTIVE: 'Active',
    DELETED: 'Deleted',
    PENDING_CONFIG: 'Pending Configuration'
  },
  SPONSOR_TYPES: {
    CORPORATE: 'Corporate',
    PERSONAL: 'Personal'
  },
  SPONSORSHIP_STATUS: {
    ACTIVE: 'Active',
    CANCELLED: 'Cancelled',
    PENDING_APPROVAL: 'Pending Approval'
  },
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  USER_TYPES: {
    COMPANY_ADMIN: 'Sponsor Admin',
    STROLO_ADMIN: 'Admin',
    ATHLETE: 'Athlete'
  },
  ATHLETE_STATUS: {
    ACTIVE: 'Active',
    DELETED: 'Deleted'
  }
};
