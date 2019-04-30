const dealInstanceController = require('../controllers/deal-instance-controller');
const { isAdminAuthenticated } = require('../middleware/admin-auth');
const { isUserAuthenticated, isMatchingUser } = require('../middleware/user-auth');

module.exports = (app, passport) => {
  /* READ all dealInstances */
  app.get(
    '/admin/dealInstances',
    isAdminAuthenticated,
    dealInstanceController.getAllDealInstances
  );

  /* READ all dealInstances given a userId */
  app.get(
    '/dealInstances/user/:userId',
    isUserAuthenticated,
    isMatchingUser,
    dealInstanceController.getAllDealInstances
  );

  /**
    * READ one dealInstance by id
    * No user authentication required since these are sharable
  */
  app.get(
    '/dealInstances/:id',
    dealInstanceController.getDealInstance
  );

  /* CREATE a dealInstance */
  app.post(
    '/dealInstances',
    isUserAuthenticated,
    dealInstanceController.createDealInstance
  );

  /**
    * Update a dealInstance by changing status to redeemed
    * No user authentication required since these are sharable
  */
  app.put(
    '/dealInstances/:id/redeem',
    dealInstanceController.redeemDealInstance
  );
}
