const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:true}))
app.set('view engine', 'ejs');
let boxes = [
  {name: 'Crossfit Montequinto', image: 'https://bit.ly/2S4JNdU'},
  {name: 'Giralda Crossfit', image: 'https://bit.ly/36HPjIN'},
  {name: 'La Colmena Crossfit', image: 'https://bit.ly/2RFcRcX'}
];

app.get('/', (req, res) => {
  res.render('landing');
})

app.get('/boxes', (req,res) => {
  res.render('boxes', {boxes})
});

app.post('/boxes', (req,res) => {
  let name = req.body.name;
  let image = req.body.image;
  let newbox = {name: name, image: image};
  boxes.push(newbox);
  res.redirect('/boxes');
})
app.get('/boxes/new', (req,res) => {
  res.render('new.ejs')
})

app.listen(3000, () => {
  console.log('Serving the YelpCamp on port 3000!')
})