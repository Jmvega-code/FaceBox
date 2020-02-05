const express    = require('express'),
      app        = express(),
      bodyParser = require('body-parser'),
      mongoose   = require('mongoose')

mongoose.connect('mongodb://localhost/boxes_app',{useNewUrlParser: true, useUnifiedTopology: true});

const boxSchema = new mongoose.Schema({
  name: String,
  image: String,
  address: String
}),
Box = mongoose.model('Box', boxSchema)

app.use(bodyParser.urlencoded({extended:true}))
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

// CREATE add new Box to db
app.post('/boxes', (req,res) => {
  let name = req.body.name;
  let image = req.body.image;
  let address= req.body.address;
  let newbox = {name, image, address};
  Box.create(newbox, (err, newbox) => {
    if(err){
      console.log(err);
    } else {
      res.redirect('/boxes');
    }
  });
});

// NEW - Show form to create new Boxes
app.get('/boxes/new', (req,res) => {
  res.render('new')
})

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

app.listen(3000, () => {
  console.log('Serving the BoxFinder on port 3000!')
});
