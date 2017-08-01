const _ = require('lodash');

const {
  Business,
  BusinessContact,
  Location,
  Idea,
  User
} = require('../models');
const { sequelize } = require('../services/database');

module.exports.getAllBusinesses = (req, res) => {
  Business.findAll({
    order: sequelize.col('name'),
    include: [
      { model: BusinessContact, as: 'businessContacts'},
      { model: Location, as: 'locations'},
      { model: Idea, as: 'ideas'},
      {
        model: User,
        as: 'businessUsers',
        attributes: {
          exclude: [
            'password', 'passwordResetToken', 'passwordResetTokenExpiration'
          ]
        },
        through: { attributes: [] }}
    ]
  }).then(businesses => {
    return res.status(200).send({ businesses });
  }).catch(err => {
    console.error('error in getAllBusinesses controller: ', err);
    return res.status(500).send({
      error: 'unable to retrieve businesses',
      details: err.message
    });
  });
};

module.exports.getBusiness = (req, res) => {
  const id = req.params.id;

  Business.findOne({
    where: { id },
    include: [
      { model: BusinessContact, as: 'businessContacts'},
      { model: Location, as: 'locations'},
      { model: Idea, as: 'ideas'},
      {
        model: User,
        as: 'businessUsers',
        attributes: {
          exclude: [
            'password', 'passwordResetToken', 'passwordResetTokenExpiration'
          ]
        },
        through: { attributes: [] }}
    ]
  }).then(business => {
    return res.status(200).send({ business });
  }).catch(err => {
    console.error('Error in getBusiness controller: ', err);
    return res.status(500).send({
      error: 'unable to retrieve business',
      details: err.message
    });
  });
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
      error: 'server error creating business',
      details: err.message
    });
  });
};

module.exports.updateBusinessUsers = (req, res) => {
  const { businessId, userId } = req.params;
  let userIds = [];

  Business.findOne({
    where: { id: businessId },
    include: [{
      model: User,
      as: 'businessUsers',
      attributes: {
        exclude: [
          'password', 'passwordResetToken', 'passwordResetTokenExpiration'
        ]
      },
      through: { attributes: [] }
    }]
  }).then(business => {
    business.businessUsers.forEach(busUser => {
      userIds.push(busUser.id);
    });

    const userIndex = _.indexOf(userIds, userId);

    if (userIndex > -1) {
      userIds.splice(userIndex, 1);

      business.setBusinessUsers(userIds).then(() => {
        return res.status(200).send({
          info: 'business users updated successfully!'
        });
      }).catch(err => {
        console.error('error updating business users: ', err);
        return res.status(500).send({
          error: 'server error updating business users',
          details: err.message
        });
      });
    } else {
      business.addBusinessUser(userId).then(() => {
        return res.status(200).send({
          info: 'business users updated successfully!'
        });
      }).catch(err => {
        console.error('error updating business users: ', err);
        return res.status(500).send({
          error: 'server error updating business users',
          details: err.message
        });
      });
    }
  }).catch(err => {
    console.error('error updating business users: ', err);
    return res.status(500).send({
      error: 'server error updating business users',
      details: err.message
    });
  });
};

module.exports.updateBusiness = (req, res) => {
  const { id } = req.params;

  Business.update(req.body, { where: { id } }).then(() => {
    return res.status(200).send({ info: 'business updated successfully!' });
  }).catch(err => {
    console.error('error updating business: ', err);
    return res.status(500).send({
      error: 'server error updating business',
      details: err.message
    });
  });
};

module.exports.deleteBusiness = (req, res) => {
  const { id } = req.params;
  const data = { status: 'deleted' };

  Business.update(data, { where: { id } }).then(() => {
    return res.status(200).send({
      info: 'Business status set to \'deleted\'!'
    });
  }).catch(err => {
    console.error('error deleting business: ', err);
    return res.status(500).send({
      error: 'server error deleting business',
      details: err.message
    });
  });
};
