const { Tag } = require('../models');
const { sequelize } = require('../services/database');

module.exports.getAllTags = (req, res) => {
  Tag.findAll({
    order: sequelize.col('name')
  }).then(tags => {
    return res.status(200).send({ tags });
  }).catch(err => {
    console.error('error in getAllTags controller: ', err);
    return res.status(500).send({
      error: 'unable to retrieve tags',
      details: err
    });
  });
};

module.exports.getTag = (req, res) => {
  const id = req.params.id;

  Tag.findOne({ where: { id } }).then(tag => {
    return res.status(200).send({ tag });
  }).catch(err => {
    console.error('Error in getTag controller: ', err);
    return res.status(500).send({
      error: 'unable to retrieve tag',
      details: err
    });
  });
};

module.exports.createTag = (req, res) => {
  const tag = req.body;

  if (!tag.name) {
    return res.status(422).send({
      error: 'You must provide a tag name'
    });
  }

  Tag.create(tag).then(tag => {
    return res.status(200).send({
      info: 'new tag created!',
      tag: tag
    });
  }).catch(err => {
    console.error('error creating tag: ', err);
    return res.status(500).send({
      error: 'server error creating tag',
      details: err
    });
  });
};

module.exports.updateTag = (req, res) => {
  const { id } = req.params;

  Tag.update(req.body, { where: { id } }).then(() => {
    return res.status(200).send({ info: 'tag updated successfully!' });
  }).catch(err => {
    console.error('error updating tag: ', err);
    return res.status(500).send({
      error: 'server error updating tag',
      details: err
    });
  });
};

module.exports.deleteTag = (req, res) => {
  const id = req.params.id;

  Tag.destroy({ where: { id } }).then(() => {
    return res.status(200).send({ info: 'tag was destroyed!' });
  }).catch(err => {
    console.error('error deleting tag: ', err);
    return res.status(500).send({ error: 'server error deleting tag' });
  });
};
