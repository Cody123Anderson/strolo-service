// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
  creation_date: Date,
  first_name: String,
  last_name: String,
  email: { type: String, required: true, unique: true },
  phone: String,
  password: { type: String, required: true },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  city: String,
  state: String,
  zip: String,
  stripe_customer_id: String,
  stripe_card_id: String,
  stripe_last_four: String
});

// methods
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
