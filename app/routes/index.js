const adminRoutes = require('./admin-routes');
const businessRoutes = require('./business-routes');
const businessContactRoutes = require('./business-contact-routes');
const categoryRoutes = require('./category-routes');
const dealRoutes = require('./deal-routes');
const dealInstanceRoutes = require('./deal-instance-routes');
const emailSubscriberRoutes = require('./email-subscriber-routes');
const healthRoutes = require('./health-routes');
const ideaRoutes = require('./idea-routes');
const ideaImageRoutes = require('./idea-image-routes');
const locationRoutes = require('./location-routes');
const tagRoutes = require('./tag-routes');
const userRoutes = require('./user-routes');

module.exports = (app) => {
  adminRoutes(app);
  businessRoutes(app);
  businessContactRoutes(app);
  categoryRoutes(app);
  dealRoutes(app);
  dealInstanceRoutes(app);
  emailSubscriberRoutes(app);
  healthRoutes(app);
  ideaRoutes(app);
  ideaImageRoutes(app);
  locationRoutes(app);
  tagRoutes(app);
  userRoutes(app);
};
