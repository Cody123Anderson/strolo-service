const dealInstanceController = require('../controllers/deal-instance-controller');
const adminAuthService = require('../services/admin-auth');

module.exports = (app, passport) => {
  /* READ all dealInstances */
  app.get('/dealInstances', dealInstanceController.getAllDealInstances);

  /* READ one dealInstance by id  */
  app.get('/dealInstances/:id', dealInstanceController.getDealInstance);

  /* CREATE a dealInstance */
  app.post(
    '/dealInstances',
    adminAuthService.isAuthenticated,
    dealInstanceController.createDealInstance
  );

  /* UPDATE a dealInstance */
  app.put(
    '/dealInstances/:id',
    adminAuthService.isAuthenticated,
    dealInstanceController.updateDealInstance
  );

  /* Delete a dealInstance */
  app.delete(
    '/dealInstances/:id',
    adminAuthService.isAuthenticated,
    dealInstanceController.deleteDealInstance
  );
}
