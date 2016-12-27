var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySchema = Schema({
  name: { type: String, required: true }
});

// create the model for Category and expose it to our app
module.exports = mongoose.model('Category', categorySchema);
