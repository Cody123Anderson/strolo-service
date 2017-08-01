const businessController = require('../controllers/business-controller');
const { isAdminAuthenticated } = require('../middleware/admin-auth');

module.exports = (app, passport) => {
  /* READ all businesses */
  app.get('/businesses', isAdminAuthenticated, businessController.getAllBusinesses);

  /* READ one business by id  */
  app.get('/businesses/:id', isAdminAuthenticated, businessController.getBusiness);

  /* CREATE a business */
  app.post('/businesses', isAdminAuthenticated, businessController.createBusiness);

  /* UPDATE a business */
  app.put(
    '/businesses/:id',
    isAdminAuthenticated,
    businessController.updateBusiness
  );

  /* Adds/Removes a user from a business */
  app.put(
    '/businesses/:businessId/user/:userId',
    isAdminAuthenticated,
    businessController.updateBusinessUsers
  );

  /* DELETE a business */
  app.delete(
    '/businesses/:id',
    isAdminAuthenticated,
    businessController.deleteBusiness
  );
}
