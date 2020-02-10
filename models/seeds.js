const mongoose = require('mongoose');
const Box = require('./models/box');


function seedDB() {
  // Remove all boxes
  Box.remove({}, (err) => {
    if(err){
      console.log(err);
    } else {
      console.log('Removed Boxes');
    }
  });
  // Add a few boxes 

  // Add a few comments
}

module.exports = seedDB;