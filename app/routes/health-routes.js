const healthController = require('../controllers/health-controller');

module.exports = (app) => {
  /* See if server is running */
  app.get('/health', healthController.healthCheck);
}
