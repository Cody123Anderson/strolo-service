const healthController = require('../controllers/health-controller');

module.exports = (app, passport) => {
  /* See if server is running */
  app.get('/health', healthController.healthCheck);
}
