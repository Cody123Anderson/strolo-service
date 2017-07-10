const { cleanObj } = require('../utils/format-data');
const uuid = require('../utils/uuid');
const { getTimestamp } = require('../utils/timestamp');

function newIdea(idea) {
  const formattedIdea = formatIdea(idea);
  const newIdea = {
    creationDate: getTimestamp(),
    id: uuid()
  };

  const completeIdea = Object.assign(formattedIdea, newIdea);

  return completeIdea;
}

function formatIdea(idea) {
  const formattedIdea = {
    businessId: idea.businessId,
    locations: idea.locations,  // Array of location ids
    tags: idea.tags, // Tag Ids
    categories: idea.categories, // category ids: Destination, Date Idea, Food, Activity, Concert
    lastUpdated: getTimestamp(),
    title: idea.title,
    description: idea.description,
    images: idea.images,
    status: idea.status // 'active', 'under construction', 'deactivated'
  }

  // Remove null or undefined attributes
  cleanObj(formattedIdea);

  return formattedIdea;
}

module.exports = { formatIdea, newIdea };
