const { IdeaImage } = require('../models');
const { sequelize } = require('../services/database');
const { uploadImage, deleteImage } = require('../utils/image-uploads');

module.exports.getImagesForIdea = (req, res) => {
  const { ideaId } = req.params;

  IdeaImage.findAll({ where: { ideaId } }).then(ideaImages => {
    return res.status(200).send({ ideaImages });
  }).catch(err => {
    console.error('error in getImagesForIdea controller: ', err);
    return res.status(500).send({
      error: 'unable to retrieve ideaImages',
      details: err.message
    });
  });
};

/* Uploads image to Cloudinary, then persists the url and id to db */
exports.createImage = (req, res) => {
  const { dataURL, ideaId } = req.body;

  if (!dataURL) {
    return res.status(422).send({
      info: 'failed to upload image',
      error: 'missing required prop - dataURL'
    });
  }

  uploadImage(dataURL).then(image => {
    const newImage = {
      ideaId: ideaId,
      cloudinaryId: image.public_id,
      url: image.secure_url,
      width: image.width,
      height: image.height
    };

    IdeaImage.create(newImage).then(ideaImage => {
      return res.status(200).send({
        info: 'new ideaImage created!',
        ideaImage: ideaImage
      });
    }).catch(err => {
      console.error('error creating ideaImage: ', err);
      return res.status(500).send({
        error: 'server error creating ideaImage',
        details: err.message
      });
    });
  }).catch(err => {
    return res.status(400).send({
      info: 'failed to upload image',
      error: err.message
    });
  });
};

/* Uploads image to Cloudinary, then persists the url and id to db */
exports.updateImage = (req, res) => {
  const { id } = req.params;
  const { dataURL, oldCloudinaryId } = req.body;

  if (!dataURL) {
    return res.status(422).send({
      info: 'failed to update image',
      error: 'missing required prop - dataURL'
    });
  } else if (!oldCloudinaryId) {
    return res.status(422).send({
      info: 'failed to update image',
      error: 'missing required prop - oldCloudinaryId'
    });
  }

  // Upload new image to Cloudinary
  uploadImage(dataURL).then(image => {
    const updatedImage = {
      cloudinaryId: image.public_id,
      url: image.secure_url,
      width: image.width,
      height: image.height
    };

    // Update the image item in the database
    IdeaImage.update(updatedImage, { where: { id } }).then(() => {
      // Delete the old image from Cloudinary
      deleteImage(oldCloudinaryId).then(() => {
        return res.status(200).send({
          info: 'ideaImage updated successfully!',
          ideaImage: updatedImage
        });
      }).catch(err => {
        return res.status(500).send({
          error: 'server error updating ideaImage',
          details: err.message
        });
      });
    }).catch(err => {
      console.error('error updating ideaImage: ', err);
      return res.status(500).send({
        error: 'server error updating ideaImage',
        details: err.message
      });
    });
  }).catch(err => {
    return res.status(400).send({
      info: 'failed to upload image',
      error: err.message
    });
  });
};

/* Deletes the image from cloudinary and then from the db */
exports.destroyImage = (req, res) => {
  const { id } = req.params;
  const { cloudinaryId } = req.body;

  if (!cloudinaryId) {
    return res.status(422).send({
      error: 'missing required param - cloudinaryId'
    });
  }

  IdeaImage.destroy({ where: { id } }).then(() => {
    deleteImage(cloudinaryId).then(() => {
      return res.status(200).send({ info: 'ideaImage was deleted!' });
    }).catch(err => {
      return res.status(500).send({
        error: 'server error deleting ideaImage',
        details: err.message
      });
    });
  }).catch(err => {
    console.error('error deleting ideaImage: ', err);
    return res.status(500).send({ error: 'server error deleting ideaImage' });
  });
};
