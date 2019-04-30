const businessContactController = require('../controllers/business-contact-controller');
const { isAdminAuthenticated } = require('../middleware/admin-auth');

module.exports = (app, passport) => {
  /* READ one businessContact by id  */
  app.get(
    '/businessContacts/:id',
    isAdminAuthenticated,
    businessContactController.getBusinessContact
  );

  /* CREATE a businessContact */
  app.post(
    '/businessContacts/:businessId',
    isAdminAuthenticated,
    businessContactController.createBusinessContact
  );

  /* UPDATE a businessContact */
  app.put(
    '/businessContacts/:id',
    isAdminAuthenticated,
    businessContactController.updateBusinessContact
  );

  /* DELETE a businessContact */
  app.delete(
    '/businessContacts/:id',
    isAdminAuthenticated,
    businessContactController.deleteBusinessContact
  );
}
