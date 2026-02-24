const express = require("express");
const router = express.Router();

const { register, login, me, refreshToken, logout } = require("../controllers/authController.js");
const auth = require("../middleware/authMiddleware.js");

router.post("/register", register);
router.post("/signup", register);
router.post("/login", login);

router.get("/me", auth, me);
router.get("/refresh", refreshToken);
router.post("/logout", logout);

module.exports = router;
