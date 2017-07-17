const locationController = require('../controllers/location-controller');
const adminAuthService = require('../services/admin-auth');

module.exports = (app, passport) => {
  /* READ one location by id  */
  app.get('/locations/:id', locationController.getLocation);

  /* READ all locations for a business by id  */
  app.get('/locations/business/:businessId', locationController.getLocationsForBusiness);

  /* CREATE a location */
  app.post('/locations', adminAuthService.isAuthenticated, locationController.createLocation);

  /* UPDATE a location */
  app.put('/locations/:id', adminAuthService.isAuthenticated, locationController.updateLocation);

  /* Delete a freeIdea */
  app.delete('/locations/:id', adminAuthService.isAuthenticated, locationController.deleteLocation);
}
