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

Business.hasMany(Location, {
  foreignKey: 'businessId',
  as: 'locations'
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
Location.belongsTo(Business, {
  foreignKey: 'businessId',
  onDelete: 'CASCADE',
});

module.exports = {
  Business,
  BusinessContact,
  Location
}
