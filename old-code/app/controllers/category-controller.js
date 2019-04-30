const { Category } = require('../models');
const { sequelize } = require('../services/database');

module.exports.getAllCategories = (req, res) => {
  Category.findAll({
    order: sequelize.col('name')
  }).then(categories => {
    return res.status(200).send({ categories });
  }).catch(err => {
    console.error('error in getAllCategories controller: ', err);
    return res.status(500).send({
      error: 'unable to retrieve categories',
      details: err
    });
  });
};

module.exports.getCategory = (req, res) => {
  const id = req.params.id;

  Category.findOne({ where: { id } }).then(category => {
    return res.status(200).send({ category });
  }).catch(err => {
    console.error('Error in getCategory controller: ', err);
    return res.status(500).send({
      error: 'unable to retrieve category',
      details: err
    });
  });
};

module.exports.createCategory = (req, res) => {
  const category = req.body;

  if (!category.name) {
    return res.status(422).send({
      error: 'You must provide a category name'
    });
  }

  Category.create(category).then(category => {
    return res.status(200).send({
      info: 'new category created!',
      category: category
    });
  }).catch(err => {
    console.error('error creating category: ', err);
    return res.status(500).send({
      error: 'server error creating category',
      details: err
    });
  });
};

module.exports.updateCategory = (req, res) => {
  const { id } = req.params;

  Category.update(req.body, { where: { id } }).then(() => {
    return res.status(200).send({ info: 'category updated successfully!' });
  }).catch(err => {
    console.error('error updating category: ', err);
    return res.status(500).send({
      error: 'server error updating category',
      details: err
    });
  });
};

module.exports.deleteCategory = (req, res) => {
  const id = req.params.id;

  Category.destroy({ where: { id } }).then(() => {
    return res.status(200).send({ info: 'category was destroyed!' });
  }).catch(err => {
    console.error('error deleting category: ', err);
    return res.status(500).send({ error: 'server error deleting category' });
  });
};
