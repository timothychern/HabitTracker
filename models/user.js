const mongoose = require("mongoose");

const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	username: String,
	password: String,
	habits: [{
		type: mongoose.Schema.Types.ObjectId,
        ref: "Habit"
	}]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);