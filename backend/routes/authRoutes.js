const express = require("express");
const router = express.Router();

// --- 1. IMPORT 'me' AND 'auth' MIDDLEWARE ---
const { register, login, me } = require("../controllers/authController.js");
const auth = require("../middleware/authMiddleware.js");

// --- 2. YOUR EXISTING ROUTES ---
router.post("/register", register);
router.post("/signup", register);
router.post("/login", login);

// --- 3. ADD THE NEW 'me' ROUTE ---
// This route is protected by the 'auth' middleware
router.get("/me", auth, me);

module.exports = router;