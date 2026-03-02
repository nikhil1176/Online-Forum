// models/User.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // ✅ User role support (added for Admin Panel)
  role: {
    type: String,
    enum: ["user", "admin"], // only 2 allowed roles
    default: "user",         // all new signups are normal users
  },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
