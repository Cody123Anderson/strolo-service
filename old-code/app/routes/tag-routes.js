const tagController = require('../controllers/tag-controller');
const { isAdminAuthenticated } = require('../middleware/admin-auth');

module.exports = (app, passport) => {
  /* READ all tags */
  app.get(
    '/tags',
    isAdminAuthenticated,
    tagController.getAllTags
  );

  /* READ one tag by id  */
  app.get(
    '/tags/:id',
    isAdminAuthenticated,
    tagController.getTag
  );

  /* CREATE a tag */
  app.post(
    '/tags',
    isAdminAuthenticated,
    tagController.createTag
  );

  /* UPDATE a tag */
  app.put(
    '/tags/:id',
    isAdminAuthenticated,
    tagController.updateTag
  );

  /* DELETE a tag */
  app.delete(
    '/tags/:id',
    isAdminAuthenticated,
    tagController.deleteTag
  );
}
