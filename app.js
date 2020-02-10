const bodyParser        = require('body-parser'),
      express           = require('express'),
      methodOverride    = require('method-override'),
      expressSanitizer  = require('express-sanitizer,')
      app               = express(),
      mongoose          = require('mongoose')

mongoose.connect('mongodb://localhost/boxes_app',{useNewUrlParser: true, useUnifiedTopology: true});

const boxSchema = new mongoose.Schema({
  name: String,
  image: String,
  address: String
});
const Box = mongoose.model('Box', boxSchema);

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');


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
      res.render('index', {allBoxes})
    }
  })
});

// NEW - Show form to create new Boxes
app.get('/boxes/new', (req,res) => {
  res.render('new')
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
  let id = req.params.id;
  Box.findById(id, (err, foundBox) => {
    if(err){
      console.log(err);
    } else {
      res.render('show', {foundBox})
    }
  })
});

// EDIT shows edit form and update a post
app.get('/boxes/:id/edit', (req,res) => {
  Box.findById(req.params.id, (err, foundBox) => {
    if(err){
      res.redirect('/boxes');
    } else {
      res.render('edit', {box: foundBox});
    }
  });
});

// UPDATE ROUTE
app.put('/boxes/:id', (req, res) => {
  Box.findByIdAndUpdate(req.params.id, req.body.box, (err, updatedBox) => {
    if(err){
      res.redirect('/boxes');
    } else {
      res.redirect('/post/' + req.params.id)
    }
  });
});

// DELETE ROUTE
app.delete('/boxes/:id', (req, res) => {
  Box.findByIdAndRemove(req.params.id, (err,) => {
    if(err){
      res.redirect('/boxes');
    } else {
      res.redirect('/boxes')
    }
  });
});

app.listen(3000, () => {
  console.log('Serving the BoxFinder on port 3000!')
});
