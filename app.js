const bodyParser        = require('body-parser'),
      express           = require('express'),
      app               = express(),
      methodOverride    = require('method-override'),
      expressSanitizer  = require('express-sanitizer'),
      mongoose          = require('mongoose'),
      flash             = require('connect-flash'),
      passport          = require('passport'),
      LocalStrategy     = require('passport-local'),
      Box               = require('./models/box'),
      Comment           = require('./models/comment'),
      User              = require('./models/user'),
      seedDB            = require('./seeds');

let commentRoutes = require('./routes/comments'),
    boxRoutes     = require('./routes/boxes'),
    indexRoutes    = require('./routes/index')


mongoose.connect('mongodb://localhost/boxes_app',{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false, useCreateIndex: true});


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));
app.use(expressSanitizer());
app.use(methodOverride('_method'));
app.use(flash());    

// seedDB(); // seed the database

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
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
}),

app.use(indexRoutes);
app.use('/boxes', boxRoutes);
app.use('/boxes/:id/comments', commentRoutes);

app.listen(3000, () => {
  console.log('Serving the FaceBox on port 3000!')
});