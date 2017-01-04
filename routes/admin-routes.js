const passport = require('passport');

const AdminController = require('../controllers/admin');
const passportService = require('../services/passport-admin');

const requireAuth = passport.authenticate('jwt', { session: false} );
const requireLogin = passport.authenticate('local', { session: false });

module.exports = (app, passport) => {
  /*
    * Test a user's token to make sure it's valid
    * Authentication required
  */
  app.get('/admin/authenticated', requireAuth, (req, res) => {
    return res.status(200).send({ authenticated: true });
  });

  /* Admin authentication route */
  app.post('/admin/login', requireLogin, AdminController.login);

  /* Creates a new admin */
  /* Only admins can create admins */
  app.post('/admin/signup', requireAuth, AdminController.signup);
}
