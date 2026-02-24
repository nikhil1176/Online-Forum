// routes/postRoutes.js
const express = require("express");
const router = express.Router();
const {
  createPost,
  getPosts,
  getPost,
  likePost,
  downvotePost,
  deletePost,
  updatePost,
  getUnapprovedPosts,
  getUnapprovedCount,
  approvePost,
  rejectPost,
  getMyPosts,
} = require("../controllers/postController");

const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// ==============================================
// 1. SPECIFIC ROUTES (Must come before /:id)
// ==============================================

// User's own posts
router.get("/my-posts", auth, getMyPosts); 

// Admin routes (Specific)
router.get("/admin/unapproved", auth, admin, getUnapprovedPosts);
router.get("/admin/unapproved-count", auth, admin, getUnapprovedCount);
router.put("/admin/:id/approve", auth, admin, approvePost);
router.put("/admin/:id/reject", auth, admin, rejectPost);

// ==============================================
// 2. GENERAL ROUTES (Public & Dynamic IDs)
// ==============================================

router.get("/", getPosts); // Get all approved posts

// Create Post
router.post("/", auth, createPost);

// Actions on specific posts (ID based)
router.get("/:id", getPost); // <--- This matches anything, so it must be after "my-posts"
router.post("/:id/like", auth, likePost);
router.post("/:id/downvote", auth, downvotePost);
router.put("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);

module.exports = router;