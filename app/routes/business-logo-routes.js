const businessLogoController = require('../controllers/business-logo-controller');
const { isAdminAuthenticated } = require('../middleware/admin-auth');

module.exports = (app) => {
  /* Get logos for a business */
  app.get(
    '/businessLogos/business/:businessId',
    isAdminAuthenticated,
    businessLogoController.getLogosForBusiness
  );

  /* Upload logo to Cloud storage */
  app.post(
    '/businessLogos',
    isAdminAuthenticated,
    businessLogoController.createLogo
  );

  /* Update Logo */
  app.put(
    '/businessLogos/:id',
    isAdminAuthenticated,
    businessLogoController.updateLogo
  );

  /* Delete Logo */
  app.delete(
    '/businessLogos/:id',
    isAdminAuthenticated,
    businessLogoController.destroyLogo
  );
}
