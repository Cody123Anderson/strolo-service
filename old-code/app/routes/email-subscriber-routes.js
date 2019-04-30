const emailSubscriberController = require('../controllers/email-subscriber-controller');

module.exports = (app) => {
  /* Adds email subscriber to email list */
  app.post('/subscriber', emailSubscriberController.postEmailSubscriber);
};
