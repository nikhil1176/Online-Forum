// backend/routes/commentRoutes.js
const express = require("express");
const router = express.Router();
const {
  addComment,
  getComments,
  upvoteComment,
  downvoteComment,
  addReply,
  getReplies,
  getUnapprovedComments,
  approveComment,
  rejectComment,
  getMyComments,
  deleteComment,
  editComment
} = require("../controllers/commentController");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// SPECIFIC ROUTES
router.get("/admin/unapproved", auth, admin, getUnapprovedComments);
router.put("/admin/:id/approve", auth, admin, approveComment);
router.put("/admin/:id/reject", auth, admin, rejectComment);

router.get("/my-comments", auth, getMyComments);
router.get("/replies/:commentId", getReplies);

// GENERAL ROUTES
router.get("/:postId", getComments);          
router.post("/:postId", auth, addComment);
router.post("/reply/:commentId", auth, addReply);
router.post("/:id/upvote", auth, upvoteComment);
router.post("/:id/downvote", auth, downvoteComment);

// --- EDIT & DELETE ROUTES ---
router.put("/:id", auth, editComment);
router.delete("/:id", auth, deleteComment);

module.exports = router;