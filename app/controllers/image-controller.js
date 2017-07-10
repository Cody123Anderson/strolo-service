const cloudinary = require('../services/cloudinary');

exports.uploadImage = (req, res) => {
  cloudinary.uploader.upload(req.body.dataURL, (image) => {
    if (image.error) {
      console.error('Error in uploadImage controller function: ', image.error.message);
      const httpCode = image.error.http_code;

      if (httpCode === 400) {
        return res.status(httpCode).send({
          info: 'failed to upload image',
          error: 'missing required prop - dataURL'
        });
      } else if (!httpCode) {
        return res.status(400).send({
          info: 'failed to upload image',
          error: 'the dataURL you passed in is invalid'
        });
      }

      return res.status(httpCode).send({
        info: 'failed to upload image',
        error: image.error.message
      });
    }

    res.json({ info: 'Image uploaded successfully', image: image });
  });
};

exports.destroyImage = (req, res) => {
  cloudinary.uploader.destroy(req.params.id, (result) => {
    res.json({ info: 'Image deleted successfully', image: result });
  });
};
