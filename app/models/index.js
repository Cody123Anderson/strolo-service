const Business = require('./business');
const BusinessContact = require('./business-contact');
const { Location } = require('./location');
const Idea = require('./idea');

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

Business.hasMany(Idea, {
  foreignKey: 'businessId',
  as: 'ideas'
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

Location.belongsToMany(Idea, {
  through: 'IdeaLocations',
  foreignKey: 'locationId'
});

/**
  * Idea Model Associations
**/
Idea.belongsTo(Business, {
  foreignKey: 'businessId',
  onDelete: 'CASCADE',
});

Idea.belongsToMany(Location, {
  through: 'IdeaLocations',
  as: 'locations',
  foreignKey: 'ideaId'
});

module.exports = {
  Business,
  BusinessContact,
  Location,
  Idea
}
