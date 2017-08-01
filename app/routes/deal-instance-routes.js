const dealInstanceController = require('../controllers/deal-instance-controller');
const { isAdminAuthenticated } = require('../middleware/admin-auth');
const { isUserAuthenticated } = require('../middleware/user-auth');

module.exports = (app, passport) => {
  /* READ all dealInstances */
  app.get(
    '/admin/dealInstances',
    isAdminAuthenticated,
    dealInstanceController.getAllDealInstances
  );

  /* READ one dealInstance by id  */
  app.get(
    '/dealInstances/:id',
    isUserAuthenticated,
    dealInstanceController.getDealInstance
  );

  /* CREATE a dealInstance */
  app.post(
    '/dealInstances',
    isUserAuthenticated,
    dealInstanceController.createDealInstance
  );

  /* Update a dealInstance by changing status to redeemed */
  app.put(
    '/dealInstances/:id/redeem',
    dealInstanceController.redeemDealInstance
  );
}
