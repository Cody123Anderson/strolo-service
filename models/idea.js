var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ideaSchema = Schema({
  business: { type: ObjectId, required: true },
  categories: [{ type: ObjectId }],
  clothes: [{ type: ObjectId }],
  description: { type: String },
  discount_percent: { type: Number },
  image_id: { type: String },
  image_url: { type: String },
  images: [],
  items: [],
  locations: [{ type: ObjectId }],
  name: { type: String },
  questions: [],
  retail_price: { type: Number },
  status: { type: String },
  type: { type: String }
});
// create the model for Businesses and expose it to our app
module.exports = mongoose.model('Idea', ideaSchema);
