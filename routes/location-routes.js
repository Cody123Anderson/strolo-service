const locationController = require('../controllers/location-controller');
const adminAuthService = require('../services/admin-auth');

module.exports = (app, passport) => {
  /* READ all locations */
  app.get('/locations', locationController.getAllLocations);

  /* READ one location by id  */
  app.get('/locations/:id', locationController.getLocation);

  /* CREATE a location */
  app.post('/locations', adminAuthService.isAuthenticated, locationController.createLocation);

  /* UPDATE a location */
  app.put('/locations/:id', adminAuthService.isAuthenticated, locationController.updateLocation);

  /* Delete a freeIdea */
  app.delete('/locations/:id', adminAuthService.isAuthenticated, locationController.deleteLocation);
}
