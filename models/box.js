const mongoose  = require('mongoose');


// MONGOOSE ESCHEMA CONFIG
const boxSchema = new mongoose.Schema({
  name: String,
  image: String,
  address: String,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:'Comment'
    }
  ]
});
module.exports = mongoose.model('Box', boxSchema);