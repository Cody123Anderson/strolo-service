const ideaImageController = require('../controllers/idea-image-controller');
const { isAdminAuthenticated } = require('../middleware/admin-auth');

module.exports = (app) => {
  /* Upload image to Cloud storage */
  app.post(
    '/ideaImages',
    isAdminAuthenticated,
    ideaImageController.createImage
  );

  /* Update Image */
  app.put(
    '/ideaImages/:id',
    isAdminAuthenticated,
    ideaImageController.updateImage
  );

  /* Delete Image */
  app.delete(
    '/ideaImages/:id',
    isAdminAuthenticated,
    ideaImageController.destroyImage
  );
}
