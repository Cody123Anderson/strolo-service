const newSubscriberEmail = require('../emails/new-subscriber');
const addContact = require('../emails/add-contact');

exports.postEmailSubscriber = (req, res, next) => {
  // Send the welcome email
  newSubscriberEmail.send([req.body.email], (err) => {
    if (err) {
      console.error('error sending new users email: ', err);
      return res.status(500).send({ status: 500, error: err });
    }

    // Subscribe new user to email list
    const data = [{
      email: req.body.email,
      region: req.body.region,
      state: req.body.state
    }];

    addContact(data, (err) => {
      if (err) {
        console.error('error adding contact to list: ', err);
        return res.status(500).send({ status: 500, error: err });
      }

      return res.status(200).send({ status: 200, info: 'New user added to email list' });
    });
  });
}
