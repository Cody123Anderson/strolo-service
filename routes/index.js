const adminRoutes = require('./admin-routes');
const emailSubscriberRoutes = require('./email-subscriber-routes');
const freeIdeaRoutes = require('./free-idea-routes');
const healthRoutes = require('./health-routes');
const imageRoutes = require('./image-routes');

module.exports = (app) => {
  adminRoutes(app);
  emailSubscriberRoutes(app);
  freeIdeaRoutes(app);
  healthRoutes(app);
  imageRoutes(app);
};
