const express = require("express");
const router = express.Router();
const { createPost, getPosts, getPost, upvotePost,downvotePost } = require("../controllers/postController.js");
const auth = require("../middleware/authMiddleware.js");

router.post("/", auth, createPost);   
router.get("/", getPosts);           
router.get("/:id", getPost);
router.post("/:id/upvote", auth, upvotePost); 
router.post("/:id/downvote", auth, downvotePost);        

module.exports = router;
