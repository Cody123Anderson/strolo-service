const categoryController = require('../controllers/category-controller');
const adminAuthService = require('../services/admin-auth');

module.exports = (app, passport) => {
  /* READ all categories */
  app.get(
    '/categories',
    adminAuthService.isAuthenticated,
    categoryController.getAllCategories
  );

  /* READ one category by id  */
  app.get(
    '/categories/:id',
    adminAuthService.isAuthenticated,
    categoryController.getCategory
  );

  /* CREATE a category */
  app.post(
    '/categories',
    adminAuthService.isAuthenticated,
    categoryController.createCategory
  );

  /* UPDATE a category */
  app.put(
    '/categories/:id',
    adminAuthService.isAuthenticated,
    categoryController.updateCategory
  );

  /* DELETE a category */
  app.delete(
    '/categories/:id',
    adminAuthService.isAuthenticated,
    categoryController.deleteCategory
  );
}
