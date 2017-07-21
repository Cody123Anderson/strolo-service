const Business = require('./business');
const BusinessContact = require('./business-contact');
const { Location } = require('./location');
const Idea = require('./idea');
const Category = require('./category');
const Tag = require('./tag');
const IdeaImage = require('./idea-image');
const Deal = require('./deal');

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

Idea.belongsToMany(Category, {
  through: 'IdeaCategories',
  as: 'categories',
  foreignKey: 'ideaId'
});

Idea.belongsToMany(Tag, {
  through: 'IdeaTags',
  as: 'tags',
  foreignKey: 'ideaId'
});

Idea.hasMany(IdeaImage, {
  foreignKey: 'ideaId',
  as: 'images'
});

Idea.hasMany(Deal, {
  foreignKey: 'ideaId',
  as: 'deals'
});

/**
  * Category Model Associations
**/
Category.belongsToMany(Idea, {
  through: 'IdeaCategories',
  foreignKey: 'categoryId'
});

/**
  * Tag Model Associations
**/
Tag.belongsToMany(Idea, {
  through: 'IdeaTags',
  foreignKey: 'tagId'
});

/**
  * IdeaImage Model Associations
**/
IdeaImage.belongsTo(Idea, {
  foreignKey: 'ideaId',
  onDelete: 'CASCADE',
});

/**
  * Deal Model Associations
**/
Deal.belongsTo(Idea, {
  foreignKey: 'ideaId',
  onDelete: 'CASCADE',
});

module.exports = {
  Business,
  BusinessContact,
  Location,
  Idea,
  Category,
  Tag,
  IdeaImage,
  Deal
}
