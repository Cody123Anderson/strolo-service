var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ideaSchema = Schema({
  business: { type: ObjectId, required: true },
  categories: [],
  clothes: [],
  description: { type: String },
  discount_percent: { type: Number },
  discount_price: { type: Number },
  images: [],
  items: [],
  locations: [{ type: ObjectId }],
  name: { type: String },
  retail_price: { type: Number },
  status: { type: String },
  type: { type: String }
});
// create the model for Businesses and expose it to our app
module.exports = mongoose.model('Idea', ideaSchema);
