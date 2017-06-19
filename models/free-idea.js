const { cleanObj } = require('../utils/format-data');

function formatFreeIdea(freeIdea) {
  const newFreeIdea = {
    businessName: freeIdea.businessName,
    description: freeIdea.description,
    images: freeIdea.images,
    locations: freeIdea.locations,
    name: freeIdea.name,
    retailPrice: freeIdea.retailPrice,
    status: freeIdea.status,
    tags: freeIdea.tags,
    type: freeIdea.type
  }

  // Remove null or undefined attributes
  cleanObj(newFreeIdea);

  return newFreeIdea;
}

module.exports = { formatFreeIdea };
