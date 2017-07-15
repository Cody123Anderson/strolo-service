const businessContactController = require('../controllers/business-contact-controller');
const adminAuthService = require('../services/admin-auth');

module.exports = (app, passport) => {
  /* READ one businessContact by id  */
  app.get('/businessContacts/:id', adminAuthService.isAuthenticated, businessContactController.getBusinessContact);

  /* CREATE a businessContact */
  app.post('/businessContacts/:businessId', adminAuthService.isAuthenticated, businessContactController.createBusinessContact);

  /* UPDATE a businessContact */
  app.put('/businessContacts/:id', adminAuthService.isAuthenticated, businessContactController.updateBusinessContact);

  /* DELETE a businessContact */
  app.delete('/businessContacts/:id', adminAuthService.isAuthenticated, businessContactController.deleteBusinessContact);
}
