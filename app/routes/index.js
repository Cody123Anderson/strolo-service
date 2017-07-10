const adminRoutes = require('./admin-routes');
const businessRoutes = require('./business-routes');
const dealRoutes = require('./deal-routes');
const dealInstanceRoutes = require('./deal-instance-routes');
const emailSubscriberRoutes = require('./email-subscriber-routes');
const freeIdeaRoutes = require('./free-idea-routes');
const healthRoutes = require('./health-routes');
const ideaRoutes = require('./idea-routes');
const imageRoutes = require('./image-routes');
const locationRoutes = require('./location-routes');
const userRoutes = require('./user-routes');

module.exports = (app) => {
  adminRoutes(app);
  businessRoutes(app);
  dealRoutes(app);
  dealInstanceRoutes(app);
  emailSubscriberRoutes(app);
  freeIdeaRoutes(app);
  healthRoutes(app);
  ideaRoutes(app);
  imageRoutes(app);
  locationRoutes(app);
  userRoutes(app);
};
