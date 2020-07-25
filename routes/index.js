const express = require("express"),
	  router = express.Router(),
	  passport = require("passport"),
	  bodyParser = require("body-parser");

// require models
const User = require("../models/user");

router.use(bodyParser.urlencoded({extended: true}));

router.get("/", (req, res) => {
	res.render("landing");
});

router.get("/register", (req, res) => {
	res.render("register");
});

router.post("/register", (req, res) => {
	let newUser = new User({username: req.body.username, 
							firstName: req.body.firstName, 
							lastName: req.body.lastName});
	User.register(newUser, req.body.password, (err, user) => {
		if (err) {
			console.log(err);
			return res.redirect("/register");
		} 
		else {
			passport.authenticate("local")(req, res, () => {
				res.redirect("/");
			});
		}
	});
});

router.get("/login", (req, res) => {
	res.render("login");
});

router.post("/login", passport.authenticate("local", {
	successRedirect: "/",
	failureRedirect: "/login"
}), (req, res) => {
	//nothing 
});

router.get("/logout", (req, res) => {
	req.logout();
	//req.flash("success", "Logged you out, see you soon!");
	res.redirect("/");
});

module.exports = router;