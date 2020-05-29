const express = require('express'),
router = express.Router(),
User = require('../models/user'),
passport = require('passport');


// LANDING PAGE
router.get('/', (req, res) => {
  res.render('landing');
})


//======================
// AUTH ROUTES
//======================

// Show register form
router.get('/register', (req,res) => {
  res.render('register')
});

// Handles sign up logic 
router.post('/register', (req,res) => {
  User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
      if(err){
        return res.render("register", {"error": err.message});
      }
      passport.authenticate('local')(req,res, () => {
        req.flash('success', 'Welcome to FaceBox,' + user.username);
        res.redirect('/boxes');
      });
  });
});

// Show login form
router.get('/login', (req, res) => {

  res.render('login');
});

// Adding login logic
router.post('/login', passport.authenticate('local', {
  successRedirect: '/boxes',
  failureRedirect: '/login'
}), (req,res) => {
});

// logout route
router.get('/logout', (req,res) => {
  req.logout();
  req.flash('success', 'Logged you out!');
  res.redirect('/boxes');
});


module.exports = router; 