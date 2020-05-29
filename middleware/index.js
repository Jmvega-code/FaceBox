let Box = require('../models/box')
let Comment = require('../models/comment')

let middlewareObj = {};

middlewareObj.checkBoxOwnership = (req, res, next) => {
  if(req.isAuthenticated()) {
    Box.findById(req.params.id, (err, foundBox) => {
      if(err){
        req.flash('error', 'Box not found');
        res.redirect('back');
      } else {
        if (foundBox.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', "You don't have permission to do that!");
          res.redirect('back');
        }
      }
    });
  } else {
    res.redirect('back');
  }
};

middlewareObj.checkCommentOwnership = (req, res, next) => {
  if(req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if(err){
        res.redirect('back');
      } else {
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', "You don't have permission to do that!");
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You need to be logged in to do that!');
    res.redirect('back');
  }
};

middlewareObj.isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()){
    
    return next();
  }
  req.flash('error', 'You need to be logged in to do that!');
  res.redirect('/login');
}



module.exports = middlewareObj;