const ideaImageController = require('../controllers/idea-image-controller');
const { isAdminAuthenticated } = require('../middleware/admin-auth');

module.exports = (app) => {
  /* Get images for an idea */
  app.get(
    '/ideaImages/idea/:ideaId',
    isAdminAuthenticated,
    ideaImageController.getImagesForIdea
  );

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
