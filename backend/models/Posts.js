// models/Posts.js
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  imageUrl: { type: String, required: false },
  tags: [{ type: String }],
  
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending' 
  },
  remarks: { 
    type: String,
    default: ''
  },

  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  // ===> ADDED THIS SECTION <===
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] 
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);