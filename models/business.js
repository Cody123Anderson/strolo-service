const { cleanObj } = require('../utils/format-data');
const uuid = require('../utils/uuid');
const { getTimestamp } = require('../utils/timestamp');

function newBusiness(bus) {
  const formattedBusiness = formatBusiness(bus);
  const newBusiness = {
    creationDate: getTimestamp(),
    id: uuid('bus')
  };
  const completeNewBusiness = Object.assign(formattedBusiness, newBusiness);

  return completeNewBusiness;
}

function formatBusiness(bus) {
  const newBusiness = {
    billingAddress: bus.billingAddress,
    billingCity: bus.billingCity,
    billingState: bus.billingState,
    billingZip: bus.billingZip,
    contactName: bus.contactName,
    contactEmail: bus.contactEmail,
    contactPhone: bus.contactPhone,
    contactPosition: bus.contactPosition,
    description: bus.description,
    lastUpdated: getTimestamp(),
    name: bus.name,
    status: bus.status,
  }

  // Remove null or undefined attributes
  cleanObj(newBusiness);

  return newBusiness;
}

module.exports = { newBusiness, formatBusiness };
