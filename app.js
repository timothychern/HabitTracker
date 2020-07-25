// require packages
const express = require("express"),
	  app = express(),
	  bodyParser = require("body-parser"),
	  mongoose = require("mongoose");

// require routes
const indexRoute = require("./routes/index");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/habit_tracker");
app.use(express.static(__dirname + "/public"));

// to use routes
app.use(indexRoute);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


app.listen(3000, function(){
	console.log("Habit Tracker started!");
})