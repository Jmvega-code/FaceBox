const mongoose = require('mongoose');
const Box = require('./models/box');
const Comment = require('./models/comment');


let data = [
  {
    name:'Crossfit Reykjavik',
    image:'https://i0.wp.com/grapevine.is/wp-content/uploads/Crossfit_timotheeLambrecq5-e1521729052777.jpg?fit=690%2C460&quality=99&ssl=1',
    address:'Reykjavik, Iceland',
  },
  {
    name:'Crossfit Mayhem',
    image:'https://morningchalkup.com/wp-content/uploads/2019/05/mayhemmain-1440xauto@2x.jpg',
    address:'601 Rich Froning Way Cookeville, TN, 38501, United States',
  },
  {
    name:'Crossfit Texas',
    image:'https://roundsfortime.com/assets/P3%20CrossFit-16a0a2a4d3e8626e799819cb423170f74c5a873036c0eb1ff31bb798a09dbb96.jpg',
    address:'Reykjavik, Iceland',
  },
]

function seedDB() {
  // Remove all boxes
  Box.remove({}, (err) => {
    if(err){
      console.log(err);
    } else {
      console.log('Removed Boxes');
    }
    // Add a few boxes
    data.forEach((seed) => {
      Box.create(seed, (err, box) => {
        if(err){
          console.log(err);
        } else {
          console.log('data added');
          // Add a few comments
          Comment.create(
            {
              text: "This box was awesome, but I wish there was Wi-Fi",
              author: "Mathew"
            }, (err, comment) => {
              if(err){
                console.log(err);
              } else {
                box.comments.push(comment);
                box.save();
                console.log('created new comment')
              }
            });
        }
      });
    });
  });

}

module.exports = seedDB;