const newSubscriberEmail = require('../emails/new-subscriber');
const addContact = require('../emails/add-contact');

module.exports = (app) => {
  app.post('/subscriber',function(req, res) {
    // Send the welcome email
    newSubscriberEmail.send([req.body.email], (err) => {
      if (err) {
        console.error('error sending new users email: ' + JSON.stringify(err, null, 4));
        res.status(500).json({ 'error sending email: ': err });
        return;
      } else {
        // Subscribe new user to email list
        const body = [{
          email: req.body.email,
          region: req.body.region,
          state: req.body.state
        }];
        addContact(body, (err) => {
          if (err) {
            console.error('error adding contact to list: ', JSON.stringify(err, null, 4));
            res.status(500).json({ 'error adding contact to list: ': err });
            return;
          }
          res.status(200).json({ 'Success: ': 'New user has been subscribed to email list' });
          return;
        });
      }
    });
  });
};
