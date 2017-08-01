const categoryController = require('../controllers/category-controller');
const { isAdminAuthenticated } = require('../middleware/admin-auth');

module.exports = (app, passport) => {
  /* READ all categories */
  app.get(
    '/categories',
    isAdminAuthenticated,
    categoryController.getAllCategories
  );

  /* READ one category by id  */
  app.get(
    '/categories/:id',
    isAdminAuthenticated,
    categoryController.getCategory
  );

  /* CREATE a category */
  app.post(
    '/categories',
    isAdminAuthenticated,
    categoryController.createCategory
  );

  /* UPDATE a category */
  app.put(
    '/categories/:id',
    isAdminAuthenticated,
    categoryController.updateCategory
  );

  /* DELETE a category */
  app.delete(
    '/categories/:id',
    isAdminAuthenticated,
    categoryController.deleteCategory
  );
}
