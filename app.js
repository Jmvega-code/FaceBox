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
      res.render('boxes/index', {allBoxes})
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

app.get('/boxes/:id/comments/new', (req,res) => {
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

app.post('/boxes/:id/comments', (req, res) => {
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




app.listen(3000, () => {
  console.log('Serving the BoxFinder on port 3000!')
});
