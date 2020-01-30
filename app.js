const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:true}))
app.set('view engine', 'ejs');
let campgrounds = [
  {name: 'Salmon Creek', image: 'https://bit.ly/2uMJXP2'},
  {name: 'Granite Hill', image: 'https://bit.ly/2S0Gp3V'},
  {name: `Mountain Goat's rest`, image: 'https://bit.ly/2U8XcEl'}
];

app.get('/', (req, res) => {
  res.render('landing');
})

app.get('/campgrounds', (req,res) => {
  res.render('campgrounds', {campgrounds})
});

app.post('/campgrounds', (req,res) => {
  let name = req.body.name;
  let image = req.body.image;
  let newcampground = {name: name, image: image};
  campgrounds.push(newcampground);
  res.redirect('/campgrounds');
})
app.get('/campgrounds/new', (req,res) => {
  res.render('new.ejs')
})

app.listen(3000, () => {
  console.log('Serving the YelpCamp on port 3000!')
})