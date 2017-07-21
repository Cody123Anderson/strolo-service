const { Idea, Location, Category, Tag, IdeaImage, Deal } = require('../models');
const { sequelize } = require('../services/database');
const { shuffleArray } = require('../utils/shuffle');

exports.getAllIdeas = (req, res) => {
  Idea.findAll({
    include: [
      {
        model: Location,
        as: 'locations',
        through: { attributes: [] }
      },
      {
        model: Category,
        as: 'categories',
        through: { attributes: [] }
      },
      {
        model: Tag,
        as: 'tags',
        through: { attributes: [] }
      },
      {
        model: IdeaImage,
        as: 'images'
      },
      {
        model: Deal,
        as: 'deals'
      }
    ],
    order: sequelize.col('title')
  }).then((ideas) => {
    return res.status(200).send({ ideas });
  }).catch(err => {
    console.error('error in getAllIdeas controller: ', err);
    return res.status(500).send({
      error: 'unable to retrieve ideas',
      details: err
    });
  });
};

exports.getIdeasForStatus = (req, res) => {
  const { status } = req.params;

  Idea.findAll({
    where: { status },
    include: [
      {
        model: Location,
        as: 'locations',
        through: { attributes: [] }
      },
      {
        model: Category,
        as: 'categories',
        through: { attributes: [] }
      },
      {
        model: Tag,
        as: 'tags',
        through: { attributes: [] }
      },
      {
        model: IdeaImage,
        as: 'images'
      },
      {
        model: Deal,
        as: 'deals'
      }
    ],
    order: sequelize.col('title')
  }).then((ideas) => {
    const shuffledIdeas = shuffleArray(ideas);

    return res.status(200).send({ ideas: shuffledIdeas });
  }).catch(err => {
    console.error('error in getIdeasForStatus controller: ', err);
    return res.status(500).send({
      error: 'unable to retrieve ideas',
      details: err
    });
  });
}

exports.getIdeasForBusiness = (req, res) => {
  const { businessId } = req.params;

  Idea.findAll({
    where: { businessId },
    include: [
      {
        model: Location,
        as: 'locations',
        through: { attributes: [] }
      },
      {
        model: Category,
        as: 'categories',
        through: { attributes: [] }
      },
      {
        model: Tag,
        as: 'tags',
        through: { attributes: [] }
      },
      {
        model: IdeaImage,
        as: 'images'
      },
      {
        model: Deal,
        as: 'deals'
      }
    ],
    order: sequelize.col('title')
  }).then((ideas) => {
    return res.status(200).send({ ideas });
  }).catch(err => {
    console.error('error in getIdeasForBusiness controller: ', err);
    return res.status(500).send({
      error: 'unable to retrieve ideas',
      details: err
    });
  });
}

exports.getIdeasWithinRadius = (req, res) => {
  return res.status(200).send({
    ideas: {
      info: 'This endpoint hasn\'t been implemented yet!'
    }
  });
}

exports.getIdea = (req, res) => {
  const { id } = req.params;

  Idea.findOne({
    where: { id },
    include: [
      {
        model: Location,
        as: 'locations',
        through: { attributes: [] }
      },
      {
        model: Category,
        as: 'categories',
        through: { attributes: [] }
      },
      {
        model: Tag,
        as: 'tags',
        through: { attributes: [] }
      },
      {
        model: IdeaImage,
        as: 'images'
      },
      {
        model: Deal,
        as: 'deals'
      }
    ]
  }).then(idea => {
    return res.status(200).send({ idea });
  }).catch(err => {
    console.error('Error in getIdea controller: ', err);
    return res.status(500).send({
      error: 'unable to retrieve idea',
      details: err
    });
  });
}

exports.createIdea = (req, res) => {
  const newIdea = req.body;
  const locationIds = newIdea.locationIds || [];
  const categoryIds = newIdea.categoryIds || [];
  const tagIds = newIdea.tagIds || [];

  if (newIdea.locationIds) { delete newIdea.locationIds; }
  if (newIdea.categoryIds) { delete newIdea.categoryIds; }
  if (newIdea.tagIds) { delete newIdea.tagIds; }

  if (!newIdea.title) {
    return res.status(422).send({
      error: 'You must provide a title'
    });
  } else if (!newIdea.businessId) {
    return res.status(422).send({
      error: 'You must provide a businessId'
    });
  }

  Idea.create(newIdea).then(idea => {
    const addLocations = new Promise((resolve, reject) => {
      if (locationIds.length > 0) {
        // There's locations to add to this idea
        Location.findAll({
          where: { id: { $in: locationIds } }
        }).then(locations => {
          if (locations.length > 0) {
            idea.addLocations(locations).then(() => {
              resolve();
            }).catch(err => { reject(err); });
          } else {
            resolve();
          }
        }).catch(err => { reject(err); });
      } else {
        resolve();
      }
    });

    const addCategories = new Promise((resolve, reject) => {
      if (categoryIds.length > 0) {
        // There's categories to add to this idea
        Category.findAll({
          where: { id: { $in: categoryIds } }
        }).then(categories => {
          if (categories.length > 0) {
            idea.addCategories(categories).then(() => {
              resolve();
            }).catch(err => { reject(err); });
          } else {
            resolve();
          }
        }).catch(err => { reject(err); });
      } else {
        resolve();
      }
    });

    const addTags = new Promise((resolve, reject) => {
      if (tagIds.length > 0) {
        // There's tags to add to this idea
        Tag.findAll({
          where: { id: { $in: tagIds } }
        }).then(tags => {
          if (tags.length > 0) {
            idea.addTags(tags).then(() => {
              resolve();
            }).catch(err => { reject(err); });
          } else {
            resolve();
          }
        }).catch(err => { reject(err); });
      } else {
        resolve();
      }
    });

    Promise.all([addLocations, addCategories, addTags]).then(values => {
      return res.status(200).send({
        info: 'new idea created!',
        idea: idea
      });
    }).catch(err => {
      console.error('error creating idea: ', err);
      return res.status(500).send({
        error: 'server error creating idea',
        details: err
      });
    });
  }).catch(err => {
    console.error('error creating idea: ', err);
    return res.status(500).send({
      error: 'server error creating idea',
      details: err
    });
  });
}

exports.updateIdea = (req, res) => {
  const { id } = req.params;
  const newIdeaFields = req.body;
  const locationIds = newIdeaFields.locationIds || [];
  const categoryIds = newIdeaFields.categoryIds || [];
  const tagIds = newIdeaFields.tagIds || [];

  if (newIdeaFields.locationIds) { delete newIdeaFields.locationIds; }
  if (newIdeaFields.categoryIds) { delete newIdeaFields.categoryIds; }
  if (newIdeaFields.tagIds) { delete newIdeaFields.tagIds; }

  Idea.findOne({ where: { id } }).then(idea => {
    idea.update(newIdeaFields, { where: { id } }).then(() => {
      const setLocations = new Promise((resolve, reject) => {
        if (locationIds.length > 0) {
          // There's locations to add to this idea
          Location.findAll({
            where: { id: { $in: locationIds } }
          }).then(locations => {
            if (locations.length > 0) {
              idea.addLocations(locations).then(() => {
                resolve();
              }).catch(err => { reject(err); });
            } else {
              resolve();
            }
          }).catch(err => { reject(err); });
        } else {
          resolve();
        }
      });

      const setCategories = new Promise((resolve, reject) => {
        if (categoryIds.length > 0) {
          // There's categories to add to this idea
          Category.findAll({
            where: { id: { $in: categoryIds } }
          }).then(categories => {
            if (categories.length > 0) {
              idea.addCategories(categories).then(() => {
                resolve();
              }).catch(err => { reject(err); });
            } else {
              resolve();
            }
          }).catch(err => { reject(err); });
        } else {
          resolve();
        }
      });

      const setTags = new Promise((resolve, reject) => {
        if (tagIds.length > 0) {
          // There's tags to add to this idea
          Tag.findAll({
            where: { id: { $in: tagIds } }
          }).then(tags => {
            if (tags.length > 0) {
              idea.addTags(tags).then(() => {
                resolve();
              }).catch(err => { reject(err); });
            } else {
              resolve();
            }
          }).catch(err => { reject(err); });
        } else {
          resolve();
        }
      });

      Promise.all([setLocations, setCategories, setTags]).then(values => {
        return res.status(200).send({ info: 'idea updated successfully!' });
      }).catch(err => {
        console.error('error creating idea: ', err);
        return res.status(500).send({
          error: 'server error creating idea',
          details: err
        });
      });
    }).catch(err => {
      console.error('error updating idea: ', err);
      return res.status(500).send({
        error: 'server error updating idea',
        details: err
      });
    });
  }).catch(err => {
    console.error('error updating idea: ', err);
    return res.status(500).send({
      error: 'server error updating idea',
      details: err
    });
  });
}

exports.deleteIdea = (req, res) => {
  const { id } = req.params;
  const data = { status: 'deleted' };

  Idea.update(data, { where: { id } }).then(() => {
    return res.status(200).send({
      info: 'Idea status set to \'deleted\'!'
    });
  }).catch(err => {
    console.error('error deleting idea: ', err);
    return res.status(500).send({
      error: 'server error deleting idea',
      details: err
    });
  });
}
