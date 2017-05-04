const userController = require('../controllers/user-controller');
const userAuthService = require('../services/user-auth');

module.exports = (app, passport) => {
  /* Return the authenticated user */
  app.get('/user', userAuthService.isAuthenticated, userController.getUserFromToken);

  /* See if a user is logged in */
  app.get('/user/authenticated', userAuthService.isAuthenticated, userController.isLoggedIn);

  /* Return favorite ideas (freeideas and ideas) for a user */
  app.get('/user/favorites', userAuthService.isAuthenticated, userController.getUserFavorites);

  /* user authentication route */
  app.post('/user/login', userController.login);

  /* Creates a new user */
  app.post('/user/signup', userController.signup);

  /* Updates a user */
  app.put('/user', userAuthService.isAuthenticated, userController.update);
}
