const passport = require('passport');

const adminController = require('../controllers/admin-controller');
const adminPassportService = require('../services/passport-admin-service'); // Sets admin jwt, and local strategies

const requireAdminAuth = passport.authenticate('jwt', { session: false} );
const requireAdminLogin = passport.authenticate('local', { session: false });

module.exports = (app, passport) => {
  /* See if a user is logged in */
  app.get('/admin/authenticated', requireAdminAuth, adminController.isLoggedIn);

  /* Admin authentication route */
  app.post('/admin/login', requireAdminLogin, adminController.login);

  /* Creates a new admin */
  /* Only admins can create admins */
  app.post('/admin/signup', adminController.signup);
}
