const cleanObj = require('../utils/clean-obj');
const uuid = require('../utils/uuid');
const { getTimestamp } = require('../utils/timestamp');

function newIdea(Idea) {
  const currentTimestamp = getTimestamp();
  const newIdea = {
    businessName: Idea.businessName,
    creationDate: currentTimestamp,
    description: Idea.description,
    id: uuid('idea'),
    images: Idea.images,
    lastUpdated: currentTimestamp,
    locations: Idea.locations, // Array of location ids
    name: Idea.name,
    retailPrice: Idea.retailPrice,
    status: Idea.status,
    tags: Idea.tags,
    type: Idea.type
  }

  // Remove null or undefined attributes
  cleanObj(newIdea);

  return newIdea;
}

function formatIdea(Idea) {
  const newIdea = {
    businessName: Idea.businessName,
    description: Idea.description,
    images: Idea.images,
    lastUpdated: getTimestamp(),
    locations: Idea.locations,  // Array of location ids
    name: Idea.name,
    retailPrice: Idea.retailPrice,
    status: Idea.status,
    tags: Idea.tags,
    type: Idea.type
  }

  // Remove null or undefined attributes
  cleanObj(newIdea);

  return newIdea;
}

module.exports = { formatIdea, newIdea };
