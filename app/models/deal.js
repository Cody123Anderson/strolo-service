const { cleanObj } = require('../utils/format-data');
const uuid = require('../utils/uuid');
const { getTimestamp } = require('../utils/timestamp');

function newDeal(deal) {
  const formattedDeal = formatDeal(deal);
  const newDeal = {
    creationDate: getTimestamp(),
    id: uuid(),
  };
  const completeNewLocation = Object.assign(formattedDeal, newDeal);

  return completeNewLocation;
}

function formatDeal(deal) {
  const formattedDeal = {
    ideaId: deal.ideaId,
    title: deal.title,
    details: deal.details,
    retailPrice: deal.retailPrice,
    discountPercent: deal.discountPercent,
    discountPricePer: deal.discountPricePer,
    maxRedemptions: deal.maxRedemptions,
    minPeople: deal.minPeople,
    maxPeople: deal.maxPeople,
    startDate: deal.startDate,
    endDate: deal.endDate,
    status: deal.status // Always active unless the idea has been deleted, then it will be 'deleted'
  };

  // Remove null or undefined attributes
  cleanObj(formattedDeal);

  return formattedDeal;
}

module.exports = { newDeal, formatDeal };
