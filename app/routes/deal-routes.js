const dealController = require('../controllers/deal-controller');
const adminAuthService = require('../services/admin-auth');

module.exports = (app, passport) => {
  /* READ all deals */
  app.get('/deals', dealController.getAllDeals);

  /* READ one deal by id  */
  app.get('/deals/:id', dealController.getDeal);

  /* CREATE a deal */
  app.post(
    '/deals',
    adminAuthService.isAuthenticated,
    dealController.createDeal
  );

  /* UPDATE a deal */
  app.put(
    '/deals/:id',
    adminAuthService.isAuthenticated,
    dealController.updateDeal
  );

  /* Delete a deal */
  app.delete(
    '/deals/:id',
    adminAuthService.isAuthenticated,
    dealController.deleteDeal
  );
}
