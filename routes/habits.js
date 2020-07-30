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
			req.flash("error", err);
			res.redirect("/");
		}
		else {
			let cur_week=[];
			let today = new Date()
			for(let i=6; i>=0; i--){
				let week_day = new Date(today - i*24*60*60*1000);
				cur_week.push(week_day.toLocaleDateString('en-US', { timeZone: 'America/New_York' }));
			}
			res.render("habits/index", {user: user, curWeek: cur_week});
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
			req.flash("error", err);
			return res.redirect("/habits");
		}
		else {
			console.log(req.body.habit);
			Habit.create(req.body.habit, (err, habit) => {
				if(err){
					req.flash("error", err);
					return res.redirect("/habits");
				} 
				else {
					user.habits.push(habit);
					user.save();
					req.flash("success", "Habit added!");
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
		req.flash("error", "you don't own this habit");
		return res.redirect("/habits");
	}
	Habit.findById(req.params.habit_id, (err, habit) => {
		if(err){
			req.flash("error", err);
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
			req.flash("error", err);
			res.redirect("back");
		} else {
			let status = req.body.status;
			console.log(req.body); 
			let today = new Date();
			today = today.toLocaleDateString('en-US', { timeZone: 'America/New_York' });
			let new_log = {date: today, status: status};
			found_habit.logged.push(new_log);
			found_habit.save();
			req.flash("success", "Status for today saved");
			res.redirect(`/habits/${req.params.habit_id}`);
		}
	});
});

// DESTROY
router.delete("/:habit_id", middleware.isLoggedIn, (req, res) => {
	Habit.findByIdAndRemove(req.params.habit_id, (err) => {
		if(err) {
			req.flash("error", err);
			res.redirect("back");
		}
		req.flash("success", "Habit deleted.");
		res.redirect("/habits")
	});
});

module.exports = router;
