const tagController = require('../controllers/tag-controller');
const adminAuthService = require('../services/admin-auth');

module.exports = (app, passport) => {
  /* READ all tags */
  app.get(
    '/tags',
    adminAuthService.isAuthenticated,
    tagController.getAllTags
  );

  /* READ one tag by id  */
  app.get(
    '/tags/:id',
    adminAuthService.isAuthenticated,
    tagController.getTag
  );

  /* CREATE a tag */
  app.post(
    '/tags',
    adminAuthService.isAuthenticated,
    tagController.createTag
  );

  /* UPDATE a tag */
  app.put(
    '/tags/:id',
    adminAuthService.isAuthenticated,
    tagController.updateTag
  );

  /* DELETE a tag */
  app.delete(
    '/tags/:id',
    adminAuthService.isAuthenticated,
    tagController.deleteTag
  );
}
