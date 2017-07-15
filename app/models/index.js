const Business = require('./business');
const BusinessContact = require('./business-contact');

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

module.exports = {
  Business,
  BusinessContact
}
