// require packages
const express = require("express"),
	  app = express(),
	  bodyParser = require("body-parser"),
	  mongoose = require("mongoose"),
	  passport = require("passport"),
	  LocalStrategy = require("passport-local"),
	  seedDB = require("./seeds"),
	  methodOverride = require("method-override"), 
	  flash = require("connect-flash");



// require models
const User = require("./models/user");
const Habit = require("./models/habit");

// require routes
const indexRoute = require("./routes/index");
const habitRoute = require("./routes/habits");

console.log(process.env.DATABASEURL);

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
// mongoose.connect("mongodb://localhost/habit_tracker");
// mongoose.connect("mongodb+srv://timothychern:WIvPNOwLiCQVSgQ8@cluster0.2drpu.mongodb.net/<dbname>?retryWrites=true&w=majority", {
mongoose.connect(process.env.DATABASEURL);
app.use(express.static(__dirname + "/public"));

//seed the database
//seedDB(); 

app.use(methodOverride("_method"));
app.use(flash());

// set up pasport
app.use(require("express-session")({
	secret: "Life is short",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

passport.authenticate('local', { failureFlash: 'Invalid username or password.' });

// to use routes 
app.use(indexRoute);
app.use('/habits', habitRoute);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


app.listen(3000, function(){
	console.log("Habit Tracker started!");
})