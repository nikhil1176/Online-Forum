const express = require("express");
const router = express.Router();
const { createPost, getPosts, getPost, upvotePost, downvotePost } = require("../controllers/postController.js");
const auth = require("../middleware/authMiddleware.js");
const upload = require("../middleware/uploadMiddleware.js"); // <-- 1. IMPORT UPLOAD

// --- 2. ADD 'upload' MIDDLEWARE HERE ---
router.post("/", auth, upload, createPost); // Multer parses the form data
// ---------------------------------------

router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/:id/upvote", auth, upvotePost);
router.post("/:id/downvote", auth, downvotePost);

module.exports = router;