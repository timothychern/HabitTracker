const mongoose = require("mongoose");
const Habit = require("./models/habit");
const User = require("./models/user")

let data = [
	{
		name: 'memorize 10 new german words',
		logged : [
			{
				date: '7/26/2020',
				status: 'done'
			}, 
			{
				date: '7/27/2020',
				status: 'skipped'
			},
			{
				date: '7/30/2020',
				status: 'done'
			}
		]
	},
	{
		name: 'drink 1L of water',
		logged : [
			{
				date: '4/11/1996',
				status: 'done'
			}
		]
	}];

function seedDB() {
	// use the timothychern id
	User.findById("5f1c8b79db9f114171c90846", (err, user) => {
		user.habits.forEach(habit => {
			console.log(habit._id);
			Habit.findByIdAndRemove(habit._id, (err) => {
				if (err) {
					consloe.log(err);
				}
				else {
					console.log("habit deleted!");
				}
			});
		});
		
		user.habits = [];
		
		let processed = 0;
		data.forEach(habit => {
			Habit.create(habit, (err, new_habit) => {
				if(err) {
					console.log(err);
				}
				else {
					user.habits.push(new_habit);
					processed++;
					if (processed === data.length){
						user.save();
					}
				}
			});
		});
	});
}


module.exports = seedDB;