const express = require('express'),
router = express.Router(),
Box = require('../models/box'),
middleWare = require('../middleware')


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
      res.render('boxes/index', {allBoxes: allBoxes})
    }
  })
});

// NEW - Show form to create new Boxes
router.get('/new', middleWare.isLoggedIn, (req,res) => {
  res.render('boxes/new')
});

// CREATE add new Box to db
router.post('/', middleWare.isLoggedIn, (req,res) => {
  let name = req.body.name,
      image = req.body.image,
      address = req.body.address,
      author = {
        username: req.user.username,
        id: req.user._id
      };
  let newBox = {name, image, address, author};
  Box.create(newBox, (err, newlyCreatedBox) => {
    if(err){
      console.log(err);
    } else {
      console.log(newBox);
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
router.get('/:id/edit', middleWare.checkBoxOwnership, (req,res) => {
    Box.findById(req.params.id, (err, foundBox) => {
      res.render('boxes/edit', {box: foundBox});
    });
});

// UPDATE BOX ROUTE
router.put('/:id', middleWare.checkBoxOwnership, (req, res) => {
  Box.findByIdAndUpdate(req.params.id, req.body.box, (err, updatedBox) => {
    if(err){
      res.redirect('/boxes');
    } else {
      res.redirect('/boxes/' + req.params.id)
    }
  });
});

// DESTROY BOX ROUTE
router.delete('/:id', middleWare.checkBoxOwnership, (req, res) => {
  Box.findByIdAndRemove(req.params.id, (err) => {
    if(err){
      console.log(err);
      res.redirect('/boxes');
    } else {
      res.redirect('/boxes');
    }
  });
});


module.exports = router; 