const adminRoutes = require('./admin-routes');
const freeIdeaRoutes = require('./free-idea-routes');
const emailSubscriberRoutes = require('./email-subscriber-routes');

module.exports = (app) => {
  adminRoutes(app);
  freeIdeaRoutes(app);
  emailSubscriberRoutes(app);
};
