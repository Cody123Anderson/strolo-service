/** Set the node environment variables */
module.exports = {
  loadEnv: (env) => {
    env.MONGO_TEST_URL = 'mongodb://localhost:27017/serenade-test';
    env.PORT = process.env.PORT || 3000;
    env.SENDGRID_API_KEY = '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';
    env.SENDGRID_LIST_ID = 793453;
  }
};
