const { cleanObj } = require('../utils/format-data');
const uuid = require('../utils/uuid');
const { getTimestamp } = require('../utils/timestamp');

function newDealInstance(deal) {
    const formattedDealInstance = formatDealInstance(deal);
    const newDealInstance = {
      creationDate: getTimestamp(),
      id: uuid(),
    };
    const completeNewDealInstance = Object.assign(
      formattedDealInstance,
      newDealInstance
    );

    return completeNewDealInstance;
}

function formatDealInstance(deal) {
  const formatDealInstance = {
    userId: deal.userId,
    businessId: deal.businessId,
    ideaId: deal.ideaId,
    dealId: deal.dealId,
    status: deal.status
  };

  // Remove null or undefined attributes
  cleanObj(formatDealInstance);

  return formatDealInstance;
}

module.exports = { newDealInstance, formatDealInstance };
