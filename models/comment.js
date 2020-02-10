const mongoose  = require('mongoose');


// MONGOOSE ESCHEMA CONFIG
const commentSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
});
module.exports = mongoose.model('Comment', commentSchema);