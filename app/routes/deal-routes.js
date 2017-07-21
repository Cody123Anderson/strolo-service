const dealController = require('../controllers/deal-controller');
const adminAuthService = require('../services/admin-auth');

module.exports = (app, passport) => {
  /* READ one deal by id  */
  app.get('/deals/:id', dealController.getDeal);

  /* READ all deals for an idea  */
  app.get('/deals/idea/:ideaId', dealController.getDealsForIdea);

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
