const mongoose = require("mongoose");

const HabitSchema = new mongoose.Schema({
	name: String,
	//TODO add tracking object
	//option 1
	// logs: mongoose.Schema.Types.Mixed,
	//option 2
	logged: [{
		date: String,
		status: String
	}]
	
});

module.exports = mongoose.model("Habit", HabitSchema);