const { cleanObj } = require('../utils/format-data');
const uuid = require('../utils/uuid');
const { getTimestamp } = require('../utils/timestamp');

function newBusiness(bus) {
  const formattedBusiness = formatBusiness(bus);
  const newBusiness = {
    creationDate: getTimestamp(),
    id: uuid()
  };
  const completeNewBusiness = Object.assign(formattedBusiness, newBusiness);

  return completeNewBusiness;
}

function formatBusiness(bus) {
  const newBusiness = {
    lastUpdated: getTimestamp(),
    name: bus.name,
    description: bus.description,
    status: bus.status,
    website: bus.website,
    contacts: bus.contacts,
    billingAddress: bus.billingAddress,
    billingCity: bus.billingCity,
    billingState: bus.billingState,
    billingZip: bus.billingZip,
    logoUrl: bus.logoUrl
  }

  // Remove null or undefined attributes
  cleanObj(newBusiness);

  return newBusiness;
}

module.exports = { newBusiness, formatBusiness };
