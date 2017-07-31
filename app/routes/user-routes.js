const userController = require('../controllers/user-controller');
const { isAuthenticated } = require('../middleware/user-auth');

module.exports = (app, passport) => {
  /* Gets the authenticated user */
  app.get(
    '/users/authenticated',
    isAuthenticated,
    userController.getUserFromToken
  );

  /* user authentication route */
  app.post('/users/login', userController.loginUser);

  /* Creates a new user */
  app.post('/users/signup', userController.signupUser);

  /* Adds/Removes a favorite idea from a  user */
  app.put(
    '/users/:userId/idea/:ideaId',
    isAuthenticated,
    userController.updateUserFavorites
  );

  /* Updates a user */
  app.put('/users/:id', isAuthenticated, userController.updateUser);
}
