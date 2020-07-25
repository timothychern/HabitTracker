const express = require("express"),
	  router = express.Router(),
	  bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({extended: true}));

router.get("/", function(req, res){
	res.render("landing");
});

module.exports = router;