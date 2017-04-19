const userController = require('../controllers/user-controller');
const userAuthService = require('../services/user-auth');

module.exports = (app, passport) => {
  /* See if a user is logged in */
  app.get('/user/authenticated', userAuthService.isAuthenticated, userController.isLoggedIn);

  /* user authentication route */
  app.post('/user/login', userController.login);

  /* Creates a new user */
  app.post('/user/signup', userController.signup);

  /* Updates a user */
  // app.put('/user/:id', userController.update);
}
