const express = require("express"),
	  router = express.Router({mergeParams: true}),
	  bodyParser = require("body-parser"),
	  middleware = require("../middleware");

const User = require("../models/user");
const Habit = require("../models/habit");

router.use(bodyParser.urlencoded({extended: true}));


// TODO all these routes need to check if the user is logged in!
// INDEX
router.get("/", middleware.isLoggedIn, (req, res) => {
	User.findById(req.user._id).populate("habits").exec((err, user) => {
		if(err){
			res.redirect("/");
		}
		else {
			res.render("habits/index", {user: user});
		}
	});
});

// NEW
router.get("/new",middleware.isLoggedIn, (req, res) => {
	res.render("habits/new");
});

// CREATE
router.post("/",middleware.isLoggedIn, (req, res) => {
	
	// find the current user
	User.findById(req.user._id, (err, user) => {
		if(err){
			return res.redirect("/habits");
		}
		else {
			console.log(req.body.habit);
			Habit.create(req.body.habit, (err, habit) => {
				if(err){
					return res.redirect("/habits");
				} 
				else {
					console.log(user);
					console.log(habit);
					user.habits.push(habit);
					user.save();
					res.redirect("/habits");
				}
			});
		}
	});
});

// SHOW

// EDIT

// UPDATE

// DESTROY

module.exports = router;
