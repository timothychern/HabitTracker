const mongoose = require("mongoose");

const HabitSchema = new mongoose.Schema({
	name: String
	//TODO add tracking object
});

module.exports = mongoose.model("Habit", HabitSchema);