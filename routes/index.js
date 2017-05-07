const adminRoutes = require('./admin-routes');
const businessRoutes = require('./business-routes');
const emailSubscriberRoutes = require('./email-subscriber-routes');
const freeIdeaRoutes = require('./free-idea-routes');
const healthRoutes = require('./health-routes');
const imageRoutes = require('./image-routes');
const userRoutes = require('./user-routes');

module.exports = (app) => {
  adminRoutes(app);
  businessRoutes(app);
  emailSubscriberRoutes(app);
  freeIdeaRoutes(app);
  healthRoutes(app);
  imageRoutes(app);
  userRoutes(app);
};
