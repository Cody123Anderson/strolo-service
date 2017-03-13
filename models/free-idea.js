const cleanObj = require('../utils/clean-obj');

function formatFreeIdea(freeIdea) {
  const newFreeIdea = {
    businessName: freeIdea.businessName,
    categories: freeIdea.categories,
    description: freeIdea.description,
    images: freeIdea.images,
    locations: freeIdea.locations,
    name: freeIdea.name,
    retailPrice: freeIdea.retailPrice,
    status: freeIdea.status,
    type: freeIdea.type
  }

  // Remove null or undefined attributes
  cleanObj(newFreeIdea);

  return newFreeIdea;
}

module.exports = { formatFreeIdea };
