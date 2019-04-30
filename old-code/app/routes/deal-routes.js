const dealController = require('../controllers/deal-controller');
const { isAdminAuthenticated } = require('../middleware/admin-auth');

module.exports = (app, passport) => {
  /* READ one deal by id  */
  app.get('/deals/:id', dealController.getDeal);

  /* READ all deals for an idea  */
  app.get('/deals/idea/:ideaId', dealController.getDealsForIdea);

  /* CREATE a deal */
  app.post(
    '/deals',
    isAdminAuthenticated,
    dealController.createDeal
  );

  /* UPDATE a deal */
  app.put(
    '/deals/:id',
    isAdminAuthenticated,
    dealController.updateDeal
  );

  /* Delete a deal */
  app.delete(
    '/deals/:id',
    isAdminAuthenticated,
    dealController.deleteDeal
  );
}
