// server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());

// CORS setup for frontend
app.use(
  cors({
    origin: "http://localhost:5173", // change this when deploying frontend
    credentials: true,
  })
);

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Welcome route
app.get("/", (req, res) => {
  res.status(200).send("Welcome to the forum API!");
});

// Routes
app.use("/api/auth", require("./routes/authRoutes.js"));
app.use("/api/posts", require("./routes/postRoutes.js"));
app.use("/api/comments", require("./routes/commentRoutes.js"));
app.use("/api/upload", require("./routes/uploadRoutes.js"));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({ error: err.message });
});

// DB + Server init
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected!");
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  })
  .catch((err) => console.error("MongoDB error:", err.message));
