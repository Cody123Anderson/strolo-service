const locationController = require('../controllers/location-controller');
const { isAdminAuthenticated } = require('../middleware/admin-auth');

module.exports = (app, passport) => {
  /* READ one location by id  */
  app.get('/locations/:id', locationController.getLocation);

  /* READ all locations for a business by id  */
  app.get(
    '/locations/business/:businessId',
    locationController.getLocationsForBusiness
  );

  /* CREATE a location */
  app.post(
    '/locations',
    isAdminAuthenticated,
    locationController.createLocation
  );

  /* UPDATE a location */
  app.put(
    '/locations/:id',
    isAdminAuthenticated,
    locationController.updateLocation
  );

  /* Delete a freeIdea */
  app.delete(
    '/locations/:id',
    isAdminAuthenticated,
    locationController.deleteLocation
  );
}
