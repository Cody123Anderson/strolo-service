const businessController = require('../controllers/business-controller');
const adminAuthService = require('../services/admin-auth');

module.exports = (app, passport) => {
  /* READ all businesses */
  app.get('/businesses', adminAuthService.isAuthenticated, businessController.getAllBusinesses);

  /* READ one freeidea by id  */
  app.get('/businesses/:id', adminAuthService.isAuthenticated, businessController.getBusiness);

  /* CREATE a business */
  app.post('/businesses', adminAuthService.isAuthenticated, businessController.createBusiness);

  /* UPDATE a business */
  app.put('/businesses/:id', adminAuthService.isAuthenticated, businessController.updateBusiness);

  /* Delete a freeIdea */
  app.delete('/businesses/:id', adminAuthService.isAuthenticated, businessController.deleteBusiness);
}
