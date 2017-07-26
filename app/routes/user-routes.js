const userController = require('../controllers/user-controller');
const userAuthMiddleware = require('../middleware/user-auth');

module.exports = (app, passport) => {
  /* Get the authenticated user */
  app.get('/user', userAuthMiddleware.isAuthenticated, userController.getUserFromToken);

  /* user authentication route */
  app.post('/user/login', userController.loginUser);

  /* Creates a new user */
  app.post('/user/signup', userController.signupUser);

  /* Updates a user */
  app.put('/user', userAuthMiddleware.isAuthenticated, userController.updateUser);
}
