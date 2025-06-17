const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
	score: Number,
	timestamp: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Score", scoreSchema);
