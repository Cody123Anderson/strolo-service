const moment = require('moment');

const {
  DealInstance,
  Business,
  Idea,
  Deal
} = require('../models');
const { sequelize } = require('../services/database');

module.exports.getAllDealInstances = (req, res) => {
  DealInstance.findAll().then(dealInstances => {
    return res.status(200).send({ dealInstances });
  }).catch(err => {
    console.error('error in getAllDealInstances controller: ', err);
    return res.status(500).send({
      error: 'unable to retrieve dealInstances',
      details: err.message
    });
  });
}

module.exports.getDealInstance = (req, res) => {
  const { id } = req.params;

  DealInstance.findOne({ where: { id }}).then(dealInstance => {
    if (dealInstance) {
      return res.status(200).send({ dealInstance });
    } else {
      // Not found
      return res.status(404).send({
        info: 'No dealInstance found with this id'
      });
    }
  }).catch(err => {
    console.error('error in getDealInstance controller: ', err);
    return res.status(500).send({
      error: 'unable to retrieve dealInstance',
      details: err.message
    });
  });
}

module.exports.createDealInstance = (req, res) => {
  const { userId, businessId, ideaId, dealId } = req.body;
  const status = 'active';

  if (!userId || !businessId || !ideaId || !dealId) {
    return res.status(422).send({ info: 'missing required parameters' });
  }

  const getBusiness = new Promise((resolve, reject) => {
    Business.findOne({ where: { id: businessId }}).then(business => {
      if (!business) reject(new Error('no business found with this id'));
      resolve(business);
    }).catch(err => { reject(err); });
  });

  const getIdea = new Promise((resolve, reject) => {
    Idea.findOne({ where: { id: ideaId }}).then(idea => {
      if (!idea) reject(new Error('no idea found with this id'));
      resolve(idea);
    }).catch(err => { reject(err); });
  });

  const getDeal = new Promise((resolve, reject) => {
    Deal.findOne({ where: { id: dealId }}).then(deal => {
      if (!deal) reject(new Error('no deal found with this id'));
      resolve(deal);
    }).catch(err => { reject(err); });
  });

  Promise.all([getBusiness, getIdea, getDeal]).then(values => {
    const business = values[0];
    const idea = values[1];
    const deal = values[2];
    const defaultExpiration = moment().add(30, 'd').format();
    const dealInstance = {
      userId: userId,
      businessId: businessId,
      ideaId: ideaId,
      dealId: dealId,
      businessName: business.name,
      businessDescription: business.description,
      businessWebsiteUrl: business.websiteUrl,
      businessLogoUrl: business.logoUrl,
      ideaTitle: idea.title,
      ideaDescription: idea.description,
      ideaReservationRequired: idea.reservationRequired,
      dealTitle: deal.title,
      dealDetails: deal.details,
      dealRetailPrice: deal.retailPrice,
      dealDiscountPrice: deal.discountPrice,
      dealDiscountPercent: deal.discountPercent,
      dealMaxRedemptions: deal.maxRedemptions || null,
      dealType: deal.type,
      status: status,
      expirationDate: idea.eventEndDate || idea.endDate || defaultExpiration
    };

    DealInstance.create(dealInstance).then(dealInstance => {
      return res.status(200).send({ dealInstance });
    }).catch(err => {
      console.error('error in createDealInstance controller: ', err);
      return res.status(500).send({
        error: 'unable to create dealInstance',
        details: err.message
      });
    });
  }).catch(err => {
    console.error('error in createDealInstance controller: ', err);
    return res.status(500).send({
      error: 'unable to create dealInstance',
      details: err.message
    });
  })
}

module.exports.redeemDealInstance = (req, res) => {
  const { id } = req.params;

  DealInstance.findOne({ where: { id } }).then(dealInstance => {
    if (dealInstance.status === 'redeemed') {
      return res.status(409).send({ error: 'deal has already been redeemed'});
    }

    DealInstance.update({ status: 'redeemed' }, { where: { id } }).then(() => {
      return res.status(200).send({ info: 'deal redeemed successfully '});
    }).catch(err => {
      console.error('error in redeemDealInstance controller: ', err);
      return res.status(500).send({
        error: 'unable to redeem dealInstance',
        details: err.message
      });
    });
  }).catch(err => {
    console.error('error in redeemDealInstance controller: ', err);
    return res.status(500).send({
      error: 'unable to redeem dealInstance',
      details: err.message
    });
  });
};
