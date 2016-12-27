var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var clothSchema = Schema({
  name: { type: String, required: true }
});

// create the model for Cloth and expose it to our app
module.exports = mongoose.model('Cloth', clothSchema);
