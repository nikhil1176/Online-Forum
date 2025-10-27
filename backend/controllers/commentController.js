const Comment = require("../models/Comment");

// Add Comment
const addComment = async (req, res) => {
  try {
    const comment = await Comment.create({
      content: req.body.content,
      author: req.user.id,
      postId: req.params.postId
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Comments for Post
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .populate("author", "username");
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Upvote a Comment
const upvoteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ msg: "Comment not found" });

    if (comment.upvotes.includes(userId)) {
      comment.upvotes = comment.upvotes.filter(id => id.toString() !== userId);
    } else {
      comment.downvotes = comment.downvotes.filter(id => id.toString() !== userId);
      comment.upvotes.push(userId);
    }

    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Downvote a Comment
const downvoteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ msg: "Comment not found" });

    if (comment.downvotes.includes(userId)) {
      comment.downvotes = comment.downvotes.filter(id => id.toString() !== userId);
    } else {
      comment.upvotes = comment.upvotes.filter(id => id.toString() !== userId);
      comment.downvotes.push(userId);
    }

    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = { addComment, getComments, upvoteComment, downvoteComment };
