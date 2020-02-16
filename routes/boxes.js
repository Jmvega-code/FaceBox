const express = require('express'),
router = express.Router(),
Box = require('../models/box')


//==========================
// BOXES RESTFUL ROUTES
//==========================

// INDEX show all boxes
router.get('/', (req,res) => {
  // Get all boxes from db
  Box.find({}, (err, allBoxes) => {
    if(err){
      console.log(err)
    } else {
      res.render('boxes/index', {allBoxes:allBoxes})
    }
  })
});

// NEW - Show form to create new Boxes
router.get('/new', isLoggedIn, (req,res) => {
  res.render('boxes/new')
});

// CREATE add new Box to db
router.post('/', isLoggedIn, (req,res) => {
  Box.create(req.body.box, (err, newBox) => {
    if(err){
      console.log(err);
    } else {
      res.redirect('/boxes');
    }
  });
});

// SHOW shows more info about a Box
router.get('/:id', (req,res) => {
  // find box with the ID
  let id = req.params.id;
  Box.findById(req.params.id).populate('comments').exec((err, foundBox) => {
    if(err){
      console.log(err);
    } else {
      console.log(foundBox);
      //render the show template withthat box
      res.render('boxes/show', {box: foundBox});
    }
  })
});

// EDIT shows edit form and update a post
router.get('/:id/edit', (req,res) => {

  Box.findById(req.params.id, (err, foundBox) => {
    if(err){
      res.redirect('/boxes');
    } else {
      res.render('boxes/edit', {box: foundBox});
    }
  });
});

// UPDATE ROUTE
router.put('/:id', (req, res) => {
  Box.findByIdAndUpdate(req.params.id, req.body.box, (err, updatedBox) => {
    if(err){
      res.redirect('/boxes');
    } else {
      res.redirect('/boxes/' + req.params.id)
    }
  });
});

// DELETE ROUTE
router.delete('/:id', (req, res) => {
  Box.findByIdAndRemove(req.params.id, (err,) => {
    if(err){
      console.log(err);
    } else {
      res.redirect('/boxes');
    }
  });
});

// Middleware
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

module.exports = router; 