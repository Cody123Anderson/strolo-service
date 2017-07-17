const { Business, BusinessContact, Location } = require('../models');
const { sequelize } = require('../services/database');

module.exports.getAllBusinesses = (req, res) => {
  Business.findAll({
    order: sequelize.col('name'),
    include: [
      { model: BusinessContact, as: 'businessContacts'}
    ]
  }).then((businesses) => {
    return res.status(200).send({ businesses });
  }).catch(err => {
    console.error('error in getAllBusinesses controller: ', err);
    return res.status(500).send({
      error: 'unable to retrieve businesses'
    });
  });
};

module.exports.getBusiness = (req, res) => {
  const id = req.params.id;

  Business.findOne({
    where: { id },
    include: [
      { model: BusinessContact, as: 'businessContacts'},
      { model: Location, as: 'locations'}
    ]
  }).then(business => {
    return res.status(200).send({ business });
  }).catch(err => {
    console.error('Error in getBusiness controller: ', err);
    return res.status(500).send({
      error: 'unable to retrieve business'
    });
  })
};

module.exports.createBusiness = (req, res) => {
  const business = req.body;

  if (!business.name) {
    return res.status(422).send({
      error: 'You must provide a business name'
    });
  }

  Business.create(business).then(business => {
    return res.status(200).send({
      info: 'new business created!',
      business: business
    });
  }).catch(err => {
    console.error('error creating business: ', err);
    return res.status(500).send({
      error: 'server error creating business'
    });
  });
};

module.exports.updateBusiness = (req, res) => {
  const id = req.params.id;

  Business.update(req.body, { where: { id } }).then(() => {
    return res.status(200).send({ info: 'business updated successfully!' });
  }).catch(err => {
    console.error('error updating business: ', err);
    return res.status(500).send({ error: 'server error updating business' });
  });
};

module.exports.deleteBusiness = (req, res) => {
  const id = req.params.id;
  const data = { status: 'deleted' };

  Business.update(data, { where: { id } }).then(() => {
    return res.status(200).send({ info: 'Business status set to \'deleted\'!' });
  }).catch(err => {
    console.error('error deleting business: ', err);
    return res.status(500).send({ error: 'server error deleting business' });
  });
};
