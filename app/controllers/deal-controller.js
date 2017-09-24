const { Deal } = require('../models');
const { sequelize } = require('../services/database');

module.exports.getDeal = (req, res) => {
  const { id } = req.params;

  Deal.findOne({ where: { id } }).then(deal => {
    return res.status(200).send({ deal });
  }).catch(err => {
    console.error('Error in getDeal controller: ', err);
    return res.status(500).send({
      error: 'unable to retrieve deal',
      details: err
    });
  });
};

module.exports.getDealsForIdea = (req, res) => {
  const { ideaId } = req.params;

  Deal.findAll({
    where: { ideaId },
    order: [['type', 'DESC']]
  }).then(deals => {
    return res.status(200).send({ deals });
  }).catch(err => {
    console.error('error in getDealsForIdea controller: ', err);
    return res.status(500).send({
      error: 'unable to retrieve deals',
      details: err
    });
  });
};

module.exports.createDeal = (req, res) => {
  const deal = req.body;

  if (!deal.ideaId) {
    return res.status(422).send({
      error: 'You must provide an ideaId for the deal'
    });
  } else if (!deal.title) {
    return res.status(422).send({
      error: 'You must provide a deal title'
    });
  } else if (!deal.retailPrice) {
    return res.status(422).send({
      error: 'You must provide a deal retailPrice'
    });
  } else if (!deal.discountPrice) {
    return res.status(422).send({
      error: 'You must provide a deal discountPrice'
    });
  } else if (!deal.type) {
    return res.status(422).send({
      error: 'You must provide a deal type'
    });
  } else if (!deal.cleverPhrase) {
    return res.status(422).send({
      error: 'You must provide a cleverPhrase to be used on date cards'
    });
  } else if (deal.type && (deal.type !== 'single' && deal.type !== 'pair')) {
    return res.status(422).send({
      error: `deal type must be either 'single' or 'pair'`
    });
  }

  // Set discountPercent for deal
  deal.discountPercent = 100 - (deal.discountPrice / deal.retailPrice * 100);

  Deal.create(deal).then(deal => {
    return res.status(200).send({
      info: 'new deal created!',
      deal: deal
    });
  }).catch(err => {
    console.error('error creating deal: ', err);
    return res.status(500).send({
      error: 'server error creating deal',
      details: err
    });
  });
};

module.exports.updateDeal = (req, res) => {
  const { id } = req.params;
  const newDeal = req.body;

  if (newDeal.type && (newDeal.type !== 'single' && newDeal.type !== 'pair')) {
    return res.status(422).send({
      error: `deal type must be either 'single' or 'pair'`
    });
  }

  Deal.findOne({ where: { id } }).then(deal => {
    // Find the new discountPercent
    newDeal.retailPrice = newDeal.retailPrice || deal.retailPrice;
    newDeal.discountPrice = newDeal.discountPrice || deal.discountPrice;
    newDeal.discountPercent = 100 - (newDeal.discountPrice / newDeal.retailPrice * 100);

    Deal.update(newDeal, { where: { id } }).then(() => {
      return res.status(200).send({ info: 'deal updated successfully!' });
    }).catch(err => {
      console.error('error updating deal: ', err);
      return res.status(500).send({
        error: 'server error updating deal',
        details: err
      });
    });
  }).catch(err => {
    console.error('Error in updateDeal controller: ', err);
    return res.status(500).send({
      error: 'unable to update deal',
      details: err
    });
  });
};

module.exports.deleteDeal = (req, res) => {
  const { id } = req.params;

  Deal.destroy({ where: { id } }).then(() => {
    return res.status(200).send({ info: 'deal was destroyed!' });
  }).catch(err => {
    console.error('error deleting deal: ', err);
    return res.status(500).send({ error: 'server error deleting deal' });
  });
};
