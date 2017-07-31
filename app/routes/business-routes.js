const businessController = require('../controllers/business-controller');
const { isAuthenticated } = require('../services/admin-auth');

module.exports = (app, passport) => {
  /* READ all businesses */
  app.get('/businesses', isAuthenticated, businessController.getAllBusinesses);

  /* READ one business by id  */
  app.get('/businesses/:id', isAuthenticated, businessController.getBusiness);

  /* CREATE a business */
  app.post('/businesses', isAuthenticated, businessController.createBusiness);

  /* UPDATE a business */
  app.put(
    '/businesses/:id',
    isAuthenticated,
    businessController.updateBusiness
  );

  /* Adds/Removes a user from a business */
  app.put(
    '/businesses/:businessId/user/:userId',
    isAuthenticated,
    businessController.updateBusinessUsers
  );

  /* DELETE a business */
  app.delete(
    '/businesses/:id',
    isAuthenticated,
    businessController.deleteBusiness
  );
}
