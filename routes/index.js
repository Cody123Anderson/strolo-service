const adminRoutes = require('./admin-routes');
const ideaRoutes = require('./idea-routes');
const subscriberRoutes = require('./subscriber-routes');

module.exports = (app) => {
  adminRoutes(app);
  ideaRoutes(app);
  subscriberRoutes(app);
};
