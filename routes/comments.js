const express = require('express'),
router = express.Router({mergeParams:true}),
Box = require('../models/box'),
Comment = require('../models/comment');

//====================
// COMMENTS ROUTES
//====================

router.get('/new', isLoggedIn , (req,res) => {
  // find box with the ID
  Box.findById(req.params.id).populate('comments').exec((err, foundBox) => {
    if(err){
      console.log(err);
    } else {
      console.log(foundBox);
      //render the show template with that box
      res.render('comments/new', {box: foundBox});
    }
  })
});

router.post('/', isLoggedIn, (req, res) => {
  //lookup box using id
  Box.findById(req.params.id, (err, box) => {
    if(err){
      console.log(err);
      res.redirect('/boxes');
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if(err){
          console.log(err);
        } else {
          box.comments.push(comment);
          box.save();
          res.redirect('/boxes/' + box._id);
        }
      });
    }
  });
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

module.exports = router; 