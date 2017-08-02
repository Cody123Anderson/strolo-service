const adminController = require('../controllers/admin-controller');
const { isAdminAuthenticated } = require('../middleware/admin-auth');

module.exports = (app, passport) => {
  /* Admin authentication route */
  app.post('/admin/login', adminController.login);

  /* Creates a new admin */
  /* Only admins can create admins */
  app.post('/admin/signup', adminController.signup);
}
