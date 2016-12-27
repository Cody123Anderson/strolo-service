// load the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// define the schema for our user model
var locationSchema = Schema({
  business: { type: ObjectId, required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true }
});

// create the model for Businesses and expose it to our app
module.exports = mongoose.model('Location', locationSchema);
