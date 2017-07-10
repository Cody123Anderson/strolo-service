const adminController = require('../controllers/admin-controller');
const adminAuthService = require('../services/admin-auth');

module.exports = (app, passport) => {
  /* See if a user is logged in */
  app.get('/admin/authenticated', adminAuthService.isAuthenticated, adminController.isLoggedIn);

  /* Admin authentication route */
  app.post('/admin/login', adminController.login);

  /* Creates a new admin */
  /* Only admins can create admins */
  app.post('/admin/signup', adminAuthService.isAuthenticated, adminController.signup);
}
