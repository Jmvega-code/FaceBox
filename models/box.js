const mongoose  = require('mongoose');


// MONGOOSE ESCHEMA CONFIG
const boxSchema = new mongoose.Schema({
  name: String,
  image: String,
  address: String
});
module.exports = mongoose.model('Box', boxSchema);