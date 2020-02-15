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
        console.log(err);
        return res.render('register');
      }
      passport.authenticate('local')(req,res, () => {
        res.redirect('/boxes')
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
  failureRedirect: '/login',
}), (req,res) => {
});

// logout route
router.get('/logout', (req,res) => {
  req.logout();
  res.redirect('/')
});

// Middleware
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

module.exports = router; 