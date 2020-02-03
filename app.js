const express    = require('express'),
      app        = express(),
      bodyParser = require('body-parser'),
      mongoose   = require('mongoose')

mongoose.connect('mongodb://localhost/boxes_app',{useNewUrlParser: true, useUnifiedTopology: true});

const boxSchema = new mongoose.Schema({
  name: String,
  image: String
}),
Box = mongoose.model('Box', boxSchema)

app.use(bodyParser.urlencoded({extended:true}))
app.set('view engine', 'ejs');







/**let boxes = [
  {name: 'Crossfit Montequinto', image: 'https://bit.ly/2S4JNdU'},
  {name: 'Giralda Crossfit', image: 'https://bit.ly/36HPjIN'},
  {name: 'La Colmena Crossfit', image: 'https://bit.ly/2RFcRcX'},
  {name: 'Crossfit Montequinto', image: 'https://bit.ly/2S4JNdU'},
  {name: 'Giralda Crossfit', image: 'https://bit.ly/36HPjIN'},
  {name: 'La Colmena Crossfit', image: 'https://bit.ly/2RFcRcX'},
  {name: 'Crossfit Montequinto', image: 'https://bit.ly/2S4JNdU'},
  {name: 'Giralda Crossfit', image: 'https://bit.ly/36HPjIN'},
  {name: 'La Colmena Crossfit', image: 'https://bit.ly/2RFcRcX'}
];
*/
app.get('/', (req, res) => {
  res.render('landing');
})

app.get('/boxes', (req,res) => {
  // Get all boxes from db
  Box.find({}, (err, allBoxes) => {
    if(err){
      console.log(err)
    } else {
      res.render('boxes', {allBoxes})
    }
  })
});

app.post('/boxes', (req,res) => {
  let name = req.body.name;
  let image = req.body.image;
  let newbox = {name: name, image: image};
  Box.create(newbox, (err, newbox) => {
    if(err){
      console.log(err);
    } else {
      console.log(newbox);
    }
  })
  res.redirect('/boxes');
})
app.get('/boxes/new', (req,res) => {
  res.render('new.ejs')
})

app.listen(3000, () => {
  console.log('Serving the YelpCamp on port 3000!')
})