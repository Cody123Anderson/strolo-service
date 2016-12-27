var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var businessSchema = Schema({
  creation_date: Date,
  email: { type: String, required: true, unique: true },
  mailto_name: String,
  mailto_address: String,
  mailto_city: String,
  mailto_state: String,
  mailto_zip: String,
  name: { type: String, required: true },
  password: { type: String, required: true },
  phone: String,
  primary_contact_name: { type: ObjectId, required: true },
  resetPasswordExpires: Date,
  resetPasswordToken: String,
  stripe_customer_id: String,
  stripe_card_id: String,
  stripe_last_four: String
});

// create the model for Businesses and expose it to our app
module.exports = mongoose.model('Business', businessSchema);
