// server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS setup: Updated for production and development
const allowedOrigins = [
  "http://localhost:5173",               // Your local Vite server
  "https://onlineforum-lime.vercel.app", // Your Vercel production app
  process.env.FRONTEND_URL               // Render environment variable
].filter(Boolean); // This removes the env variable if it's currently empty

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or server-to-server requests)
      if (!origin) return callback(null, true);
      
      // If the origin is in our allowed list, let it pass
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
    },
    credentials: true,
  })
);

// Health check route for Render monitoring
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Welcome route
app.get("/", (req, res) => {
  res.status(200).send("Welcome to the forum API!");
});

// Routes
// Note: Ensure these filenames match exactly (case-sensitive) in your folders
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
  console.error("Error Details:", err.message);
  res.status(err.status || 500).json({ error: err.message });
});

// DB + Server Initialization
// Using 0.0.0.0 is required for Render's port detection
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
  
  // Connect to MongoDB after the server starts to avoid Port Scan Timeouts
  if (process.env.MONGO_URI) {
    mongoose
      .connect(process.env.MONGO_URI)
      .then(() => console.log("MongoDB connected successfully!"))
      .catch((err) => console.error("MongoDB connection error:", err.message));
  } else {
    console.error("Error: MONGO_URI is not defined in environment variables.");
  }
});