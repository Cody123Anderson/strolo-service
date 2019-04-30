const { BusinessLogo } = require('../models');
const { sequelize } = require('../services/database');
const { uploadImage, deleteImage } = require('../utils/image-uploads');

module.exports.getLogosForBusiness = (req, res) => {
  const { businessId } = req.params;

  BusinessLogo.findAll({ where: { businessId } }).then(businessLogos => {
    return res.status(200).send({ businessLogos });
  }).catch(err => {
    console.error('error in getLogosForBusiness controller: ', err);
    return res.status(500).send({
      error: 'unable to retrieve businessLogos',
      details: err
    });
  });
};

/* Uploads image to Cloudinary, then persists the url and id to db */
exports.createLogo = (req, res) => {
  const { dataURL, businessId } = req.body;

  if (!dataURL) {
    return res.status(422).send({
      info: 'failed to upload image',
      error: 'missing required prop - dataURL'
    });
  } else if (!businessId) {
    return res.status(422).send({
      info: 'failed to upload image',
      error: 'missing required prop - businessId'
    });
  }

  uploadImage(dataURL).then(image => {
    const newImage = {
      businessId: businessId,
      cloudinaryId: image.public_id,
      url: image.secure_url,
      width: image.width,
      height: image.height
    };

    BusinessLogo.create(newImage).then(businessLogo => {
      return res.status(200).send({
        info: 'new businessLogo created!',
        businessLogo: businessLogo
      });
    }).catch(err => {
      console.error('error creating businessLogo: ', err);
      return res.status(500).send({
        error: 'server error creating businessLogo',
        details: err
      });
    });
  }).catch(err => {
    return res.status(400).send({
      info: 'failed to upload logo',
      error: err
    });
  });
};

/* Uploads image to Cloudinary, then persists the url and id to db */
exports.updateLogo = (req, res) => {
  const { id } = req.params;
  const { dataURL, oldCloudinaryId } = req.body;

  if (!dataURL) {
    return res.status(422).send({
      info: 'failed to update logo',
      error: 'missing required prop - dataURL'
    });
  } else if (!oldCloudinaryId) {
    return res.status(422).send({
      info: 'failed to update logo',
      error: 'missing required prop - oldCloudinaryId'
    });
  }

  // Upload new logo to Cloudinary
  uploadImage(dataURL).then(image => {
    const updatedImage = {
      cloudinaryId: image.public_id,
      url: image.secure_url,
      width: image.width,
      height: image.height
    };

    // Update the logo item in the database
    BusinessLogo.update(updatedImage, { where: { id } }).then(() => {
      // Delete the old logo from Cloudinary
      deleteImage(oldCloudinaryId).then(() => {
        return res.status(200).send({
          info: 'businessLogo updated successfully!',
          businessLogo: updatedImage
        });
      }).catch(err => {
        console.error('error updating businessLogo: ', err);
        return res.status(500).send({
          error: 'server error updating businessLogo',
          details: err
        });
      });
    }).catch(err => {
      console.error('error updating businessLogo: ', err);
      return res.status(500).send({
        error: 'server error updating businessLogo',
        details: err
      });
    });
  }).catch(err => {
    return res.status(400).send({
      info: 'failed to upload logo',
      error: err
    });
  });
};

/* Deletes the image from cloudinary and then from the db */
exports.destroyLogo = (req, res) => {
  const { id } = req.params;
  const { cloudinaryId } = req.body;

  if (!cloudinaryId) {
    return res.status(422).send({
      error: 'missing required param - cloudinaryId'
    });
  }

  BusinessLogo.destroy({ where: { id } }).then(() => {
    deleteImage(cloudinaryId).then(() => {
      return res.status(200).send({ info: 'businessLogo was deleted!' });
    }).catch(err => {
      return res.status(500).send({
        error: 'server error deleting businessLogo',
        details: err
      });
    });
  }).catch(err => {
    console.error('error deleting businessLogo: ', err);
    return res.status(500).send({ error: 'server error deleting businessLogo' });
  });
};
