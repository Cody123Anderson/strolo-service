const imageController = require('../controllers/image-controller');
const adminAuthService = require('../services/admin-auth');

module.exports = (app) => {
  /* Upload image to Cloud storage */
  app.post('/images', adminAuthService.isAuthenticated, imageController.uploadImage);

  /* Delete Image */
  app.delete('/images/:id', adminAuthService.isAuthenticated, imageController.destroyImage);
}
