const express = require("express");
const router = express.Router();
const Score = require("../models/Score");

// Simple test route
router.get("/test", (req, res) => {
	res.json({ message: "Test route works!" });
});

// GET average scores
router.get("/average", async (req, res) => {
	try {
		const scores = await Score.find({});
		if (scores.length === 0) {
			return res.json({ averageScore: 0, highScoreAvg: 0 });
		}

		const averageScore =
			scores.reduce((sum, s) => sum + s.score, 0) / scores.length;
		res.json({
			averageScore,
			highScoreAvg: averageScore, // Adjust if you have different logic
		});
	} catch (error) {
		console.error("Error in /average:", error);
		res.status(500).json({ error: "Server error" });
	}
});

module.exports = router;
