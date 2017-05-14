const cleanObj = require('../utils/clean-obj');
const uuid = require('../utils/uuid');
const { getTimestamp } = require('../utils/timestamp');

function formatNewBusiness(bus) {
    const currentTimestamp = getTimestamp();
    const newBusiness = {
      billingAddress: bus.billingAddress,
      billingCity: bus.billingCity,
      billingState: bus.billingState,
      billingZip: bus.billingZip,
      contactName: bus.contactName,
      contactEmail: bus.contactEmail,
      contactPhone: bus.contactPhone,
      creationDate: currentTimestamp,
      id: uuid('bus'),
      lastUpdated: currentTimestamp,
      name: bus.name,
      status: bus.status
    };

    // Remove null or undefined attributes
    cleanObj(newBusiness);

    return newBusiness;
}

function formatBusiness(bus) {
  const newBusiness = {
    lastUpdated: getTimestamp(),
    name: bus.name,
    status: bus.status,
  }

  // Remove null or undefined attributes
  cleanObj(newBusiness);

  return newBusiness;
}

module.exports = { formatNewBusiness, formatBusiness };
