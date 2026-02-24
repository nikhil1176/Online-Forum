// controllers/authController.js

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Create Access & Refresh Tokens
const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

// Register User
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "User already exists" });

    const userCount = await User.countDocuments();
    const role = userCount === 0 ? "admin" : "user";

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    const accessToken = createAccessToken({ id: user._id, role: user.role });
    const refreshToken = createRefreshToken({ id: user._id, role: user.role });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // set true on production https
      sameSite: "strict",
      path: "/",
    });

    res.status(201).json({ msg: "User registered", accessToken, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login User
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid password" });

    const accessToken = createAccessToken({ id: user._id, role: user.role });
    const refreshToken = createRefreshToken({ id: user._id, role: user.role });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
    });

    res.json({ msg: "Login successful", accessToken, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Logged-in User
const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// Refresh Access Token
const refreshToken = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ msg: "No refresh token" });

  jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ msg: "Invalid refresh token" });

    const newAccessToken = createAccessToken({ id: decoded.id, role: decoded.role });
    res.json({ accessToken: newAccessToken });
  });
};

// Logout User
const logout = (req, res) => {
  res.clearCookie("refreshToken", { path: "/" });
  res.json({ msg: "Logged out" });
};

module.exports = { register, login, me, refreshToken, logout };
