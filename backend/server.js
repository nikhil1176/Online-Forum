const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path"); // <-- 1. IMPORT PATH MODULE

dotenv.config();

const app = express();

//  Core middlewares
app.use(cors());                 // allow requests from frontend/local
app.use(express.json());         // parse JSON bodies

// --- 2. ADD THIS LINE ---
// This serves all files in the 'uploads' folder publicly
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// ------------------------

// Health check for quick testing
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Welcome message for the root URL
app.get("/", (req, res) => {
  res.status(200).send("Welcome to the forum API!");
});

//  Mounting the routes
app.use("/api/auth", require("./routes/authRoutes.js"));
app.use("/api/posts", require("./routes/postRoutes.js"));
app.use("/api/comments", require("./routes/commentRoutes.js"));

//  404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

//  Global error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

//  Connecting to DB and starting the server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error(" MONGO_URI missing in .env");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI, { dbName: process.env.DB_NAME || undefined })
  .then(() => {
    console.log(" MongoDB connected successfulyy!!!!!");
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error(" MongoDB connection error:", err.message);
    process.exit(1);
  });