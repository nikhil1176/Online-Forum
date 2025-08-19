const express = require("express");
const router = express.Router();
const { addComment, getComments, upvoteComment, downvoteComment } = require("../controllers/commentController.js");
const auth = require("../middleware/authMiddleware.js");

router.post("/:postId", auth, addComment);  
router.get("/:postId", getComments);       
router.post("/:id/upvote", auth, upvoteComment);    
router.post("/:id/downvote", auth, downvoteComment); 
module.exports = router;
