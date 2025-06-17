require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const scoreRoutes = require("./routes/score");

const app = express();

// Middleware
app.use(
	cors({
		origin: "http://localhost:5173", // Your React app's origin
		credentials: true,
	})
);
app.use(express.json());

// Database connection - Updated for MongoDB Driver v4+
mongoose
	.connect(process.env.MONGO_URI)
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/score", scoreRoutes);

// Error handling for undefined routes
app.use((req, res) => {
	res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
