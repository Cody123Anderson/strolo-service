const cloudinary = require('../services/cloudinary');

/* Uploads an image to Cloudinary */
exports.uploadImage = dataUrl => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(dataUrl, (image) => {
      if (image.error) {
        if (!image.error.http_code) {
          reject({
            status: 400,
            message: 'failed to upload image - the dataURL you provided is invalid'
          });
        }

        reject(image.error);
      }

      resolve(image);
    });
  });
}

/* Destroys an image in Cloudinary */
exports.deleteImage = imageId => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(imageId, result => {
      if (result.result === 'not found') {
        reject('image was already deleted');
      }

      resolve();
    });
  });
}