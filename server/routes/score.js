const express = require("express");
const router = express.Router();
const Score = require("../models/Score");

router.post("/", async (req, res) => {
	try {
		const { score } = req.body;

		if (!score || typeof score !== "number") {
			return res.status(400).json({ error: "Invalid score provided" });
		}

		const newScore = new Score({ score });
		await newScore.save();

		res.status(201).json({
			success: true,
			score: newScore.score,
			timestamp: newScore.timestamp,
		});
	} catch (error) {
		console.error("Error saving score:", error);
		res.status(500).json({ error: "Server error" });
	}
});

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
		});
	} catch (error) {
		console.error("Error in /average:", error);
		res.status(500).json({ error: "Server error" });
	}
});

module.exports = router;
