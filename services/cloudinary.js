const cloudinary = require('cloudinary');

const config = require('../config');

//Cloudinary Image Config
cloudinary.config({
  cloud_name: config.CLOUDINARY_PUBLIC_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET
});

module.exports = cloudinary;
