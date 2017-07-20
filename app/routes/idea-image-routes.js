const ideaImageController = require('../controllers/idea-image-controller');
const adminAuthService = require('../services/admin-auth');

module.exports = (app) => {
  /* Upload image to Cloud storage */
  app.post(
    '/ideaImages',
    adminAuthService.isAuthenticated,
    ideaImageController.createImage
  );

  /* Update Image */
  app.put(
    '/ideaImages/:id',
    adminAuthService.isAuthenticated,
    ideaImageController.updateImage
  );

  /* Delete Image */
  app.delete(
    '/ideaImages/:id',
    adminAuthService.isAuthenticated,
    ideaImageController.destroyImage
  );
}
