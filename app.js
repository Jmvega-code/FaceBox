const bodyParser        = require('body-parser'),
      express           = require('express'),
      app               = express(),
      methodOverride    = require('method-override'),
      expressSanitizer  = require('express-sanitizer'),
      mongoose          = require('mongoose'),
      passport          = require('passport'),
      LocalStrategy     = require('passport-local'),
      Box               = require('./models/box'),
      Comment           = require('./models/comment'),
      User              = require('./models/user'),
      seedDB            = require('./seeds');


mongoose.connect('mongodb://localhost/boxes_app',{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false, useCreateIndex: true});


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));
app.use(expressSanitizer());
app.use(methodOverride('_method'));    
seedDB();

// PASSPORT COFIGURATION
app.use(require('express-session')({
  secret: 'Rusty wins the cutest dog contest',
  resave:false,
  saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res, next) => {
  res.locals.currentUser = req.user;
  next();
}),









//====================
// RESTFUL ROUTES
//====================


// LANDING PAGE
app.get('/', (req, res) => {
  res.render('landing');
})

// INDEX show all boxes
app.get('/boxes', (req,res) => {
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
app.get('/boxes/new', (req,res) => {
  res.render('boxes/new')
});

// CREATE add new Box to db
app.post('/boxes', (req,res) => {
  Box.create(req.body.box, (err, newBox) => {
    if(err){
      console.log(err);
    } else {
      res.redirect('/boxes');
    }
  });
});

// SHOW shows more info about a Box
app.get('/boxes/:id', (req,res) => {
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
app.get('/boxes/:id/edit', (req,res) => {

  Box.findById(req.params.id, (err, foundBox) => {
    if(err){
      res.redirect('/boxes');
    } else {
      res.render('boxes/edit', {box: foundBox});
    }
  });
});

// UPDATE ROUTE
app.put('/boxes/:id', (req, res) => {
  Box.findByIdAndUpdate(req.params.id, req.body.box, (err, updatedBox) => {
    if(err){
      res.redirect('/boxes');
    } else {
      res.redirect('/boxes/' + req.params.id)
    }
  });
});

// DELETE ROUTE
app.delete('/boxes/:id', (req, res) => {
  Box.findByIdAndRemove(req.params.id, (err,) => {
    if(err){
      console.log(err);
    } else {
      res.redirect('/boxes');
    }
  });
});










//====================
// COMMENTS ROUTES
//====================

app.get('/boxes/:id/comments/new', isLoggedIn , (req,res) => {
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

app.post('/boxes/:id/comments', isLoggedIn, (req, res) => {
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









//======================
// AUTH ROUTES
//======================


// Show register form
app.get('/register', (req,res) => {
  res.render('register')
});

// Handles sign up logic 
app.post('/register', (req,res) => {
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

// SHow login form
app.get('/login', (req, res) => {
  res.render('login');
});

// Adding login logic
app.post('/login', passport.authenticate('local', {
  successRedirect: '/boxes',
  failureRedirect: '/login',
}), (req,res) => {
});

// logout
app.get('/logout', (req,res) => {
  req.logout();
  res.redirect('/')
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

app.listen(3000, () => {
  console.log('Serving the BoxFinder on port 3000!')
});
