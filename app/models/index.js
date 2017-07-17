const Business = require('./business');
const BusinessContact = require('./business-contact');
const { Location } = require('./location');

/**
  * Business Model Associations
**/
Business.hasMany(BusinessContact, {
  foreignKey: 'businessId',
  as: 'businessContacts'
});

/**
  * BusinessContact Model Associations
**/
BusinessContact.belongsTo(Business, {
  foreignKey: 'businessId',
  onDelete: 'CASCADE',
});

/**
  * Location Model Associations
**/

module.exports = {
  Business,
  BusinessContact,
  Location
}
