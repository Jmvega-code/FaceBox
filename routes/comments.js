const express = require('express'),
router = express.Router({mergeParams:true}),
Box = require('../models/box'),
Comment = require('../models/comment'),
middleWare = require('../middleware')

//====================
// COMMENTS ROUTES
//====================

router.get('/new', middleWare.isLoggedIn , (req,res) => {
  // find box with the ID
  Box.findById(req.params.id).populate('comments').exec((err, foundBox) => {
    if(err){
      console.log(err);
    } else {
      //render the show template with that box
      res.render('comments/new', {box: foundBox});
    }
  })
});

// CREATE add new Comment to db
router.post('/', middleWare.isLoggedIn, (req, res) => {
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
          // Add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // Save comment 
          comment.save();
          // push the comment in to the comments array
          box.comments.push(comment);
          box.save();
          console.log(comment);
          res.redirect('/boxes/' + box._id);
        }
      });
    }
  });
});

// COMMENTS EDIT ROUTE
router.get('/:comment_id/edit', middleWare.checkCommentOwnership, (req, res) => {
  Comment.findById(req.params.comment_id, (err, foundComment) => {
    if(err){
      res.redirect('back');
    } else {
      res.render('comments/edit', {box_id: req.params.id, comment: foundComment});
    }
  });
})

// COMMENTS UPDATE ROUTE
router.put('/:comment_id', middleWare.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
    if(err){
      res.redirect('back');
    } else {
      res.redirect('/boxes/' + req.params.id );
    }
  })
});

// COMMENT DESTROY ROUTE
router.delete('/:comment_id', middleWare.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err) => {
    if(err){
      console.log(err);
      res.redirect('back');
    } else {
      res.redirect('/boxes/' + req.params.id);
    }
  });
});


module.exports = router; 