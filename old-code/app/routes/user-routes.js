const userController = require('../controllers/user-controller');
const { isUserAuthenticated } = require('../middleware/user-auth');

module.exports = (app) => {
  /* Gets the authenticated user */
  app.get(
    '/users/authenticated',
    isUserAuthenticated,
    userController.getUserFromToken
  );

  /* user authentication route */
  app.post('/users/login', userController.loginUser);

  /* Creates a new user */
  app.post('/users/signup', userController.signupUser);

  /* Adds/Removes a favorite idea from a  user */
  app.put(
    '/users/:userId/idea/:ideaId',
    isUserAuthenticated,
    userController.updateUserFavorites
  );

  /* Updates a user */
  app.put(
    '/users/:id',
    isUserAuthenticated,
    userController.updateUser
  );
};
