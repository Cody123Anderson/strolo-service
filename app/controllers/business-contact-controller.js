const { BusinessContact } = require('../models');

module.exports.getBusinessContact = (req, res) => {
  const id = req.params.id;

  BusinessContact.findById(id).then(businessContact => {
    return res.status(200).send({ businessContact });
  }).catch(err => {
    console.error('Error in getBusinessContact controller: ', err);
    return res.status(500).send({
      error: 'unable to retrieve businessContact',
      details: err
    });
  });
};

module.exports.createBusinessContact = (req, res) => {
  const businessContact = req.body;

  // Add businessID to businessContact object
  businessContact.businessId = req.params.businessId;

  // Check for required fields
  if (!businessContact.name) {
    return res.status(422).send({
      error: 'You must provide a businessContact name'
    });
  }

  BusinessContact.create(businessContact).then(businessContact => {
    return res.status(200).send({
      info: 'new businessContact created!',
      businessContact: businessContact
    });
  }).catch(err => {
    console.error('error creating businessContact: ', err);
    return res.status(500).send({
      error: 'server error creating businessContact'
    });
  });
};

module.exports.updateBusinessContact = (req, res) => {
  const id = req.params.id;

  BusinessContact.update(req.body, { where: { id } }).then(() => {
    return res.status(200).send({ info: 'businessContact updated successfully!' });
  }).catch(err => {
    console.error('error updating businessContact: ', err);
    return res.status(500).send({ error: 'server error updating businessContact' });
  });
};

module.exports.deleteBusinessContact = (req, res) => {
  const id = req.params.id;

  BusinessContact.destroy({ where: { id } }).then(() => {
    return res.status(200).send({ info: 'businessContact was destroyed!' });
  }).catch(err => {
    console.error('error deleting businessContact: ', err);
    return res.status(500).send({ error: 'server error deleting businessContact' });
  });
};
