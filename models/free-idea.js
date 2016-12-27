var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ideaSchema = Schema({
  business_name: { type: String },
  categories: [{ type: ObjectId }],
  description: { type: String },
  images: [],
  locations: [],
  name: { type: String },
  retail_price: { type: Number },
  status: { type: String },
  type: { type: String }
});
// create the model for Businesses and expose it to our app
module.exports = mongoose.model('FreeIdea', ideaSchema);
