const mongoose  = require('mongoose');


// MONGOOSE ESCHEMA CONFIG
let userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});
module.exports = mongoose.model('User', userSchema);