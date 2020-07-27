const express = require("express"),
	  router = express.Router({mergeParams: true}),
	  bodyParser = require("body-parser"),
	  middleware = require("../middleware"),
	  mongoose = require("mongoose");

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
					user.habits.push(habit);
					user.save();
					res.redirect("/habits");
				}
			});
		}
	});
});

// SHOW
router.get("/:habit_id", middleware.isLoggedIn, (req, res) => {
	// need to check if user owns the habit (check if habit_id is in habits list)
	if (!req.user.habits.includes(req.params.habit_id)){
		console.log(req.user.habits);
		console.log(req.params.habit_id);
		res.send("you don't own this habit");
	}
	Habit.findById(req.params.habit_id, (err, habit) => {
		if(err){
			res.redirect('/habits');
		} 
		else {
			res.render("habits/show", {habit: habit});
		}
	});
	
})

// EDIT

// UPDATE
router.put("/:habit_id", middleware.isLoggedIn, (req, res) => {
	Habit.findById(req.params.habit_id, (err, found_habit) => {
		if(err){
			res.redirect("back");
		} else {
			let status = req.body.status;
			console.log(req.body); 
			let today = new Date();
			today = today.toLocaleDateString('en-US', { timeZone: 'America/New_York' });
			//make sure today is not in logs already
			//found_habit.logs[today] = status;
			let new_log = {date: today, status: status};
			found_habit.logged.push(new_log);
			found_habit.save();
			res.redirect(`/habits/${req.params.habit_id}`);
		}
	});
});

// DESTROY

module.exports = router;
