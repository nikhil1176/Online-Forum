// backend/controllers/commentController.js
const Comment = require("../models/Comment");

// ADD COMMENT
const addComment = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === "admin";
    const comment = await Comment.create({
      text: req.body.text,
      author: req.user.id,
      postId: req.params.postId,
      parentCommentId: null,
      status: isAdmin ? 'approved' : 'pending',
    });
    const populated = await comment.populate("author", "username");
    if (isAdmin) return res.status(201).json(populated);
    res.status(201).json({ msg: "Comment submitted for approval", comment: populated });
  } catch (err) { next(err); }
};

// ADD REPLY
const addReply = async (req, res, next) => {
  try {
    const parent = await Comment.findById(req.params.commentId);
    if (!parent) return res.status(404).json({ msg: "Parent comment not found" });

    const isAdmin = req.user.role === "admin";
    const reply = await Comment.create({
      text: req.body.text,
      author: req.user.id,
      postId: parent.postId,
      parentCommentId: req.params.commentId,
      status: isAdmin ? 'approved' : 'pending',
    });
    const populated = await reply.populate("author", "username");
    if (isAdmin) return res.status(201).json(populated);
    res.status(201).json({ msg: "Reply submitted for approval", reply: populated });
  } catch (err) { next(err); }
};

// GET COMMENTS
const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({
      postId: req.params.postId,
      parentCommentId: null,
      status: 'approved',
    }).populate("author", "username").sort({ createdAt: -1 });

    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({
          parentCommentId: comment._id,
          status: 'approved',
        }).populate("author", "username").sort({ createdAt: 1 });
        return { ...comment.toObject(), replies };
      })
    );
    res.json(commentsWithReplies);
  } catch (err) { next(err); }
};

// GET REPLIES
const getReplies = async (req, res, next) => {
  try {
    const replies = await Comment.find({
      parentCommentId: req.params.commentId,
      status: 'approved',
    }).populate("author", "username").sort({ createdAt: 1 });
    res.json(replies);
  } catch (err) { next(err); }
};

// VOTE FUNCTIONS
const upvoteComment = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ msg: "Comment not found" });
    comment.downvotes = comment.downvotes.filter((id) => id.toString() !== userId);
    const index = comment.upvotes.indexOf(userId);
    if (index === -1) comment.upvotes.push(userId);
    else comment.upvotes.splice(index, 1);
    await comment.save();
    const populated = await comment.populate("author", "username");
    res.json({ msg: "Upvote updated", comment: populated });
  } catch (err) { next(err); }
};

const downvoteComment = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ msg: "Comment not found" });
    comment.upvotes = comment.upvotes.filter((id) => id.toString() !== userId);
    const index = comment.downvotes.indexOf(userId);
    if (index === -1) comment.downvotes.push(userId);
    else comment.downvotes.splice(index, 1);
    await comment.save();
    const populated = await comment.populate("author", "username");
    res.json({ msg: "Downvote updated", comment: populated });
  } catch (err) { next(err); }
};

// ADMIN FUNCTIONS
const getUnapprovedComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ status: 'pending' })
      .populate("author", "username")
      .populate("postId", "title")
      .sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) { next(err); }
};

const approveComment = async (req, res, next) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', remarks: '' },
      { new: true }
    );
    if (!comment) return res.status(404).json({ msg: "Comment not found" });
    res.json({ msg: "Comment approved", comment });
  } catch (err) { next(err); }
};

const rejectComment = async (req, res, next) => {
  try {
    const { remarks } = req.body;
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', remarks: remarks },
      { new: true }
    );
    if (!comment) return res.status(404).json({ msg: "Comment not found" });
    res.json({ msg: "Comment rejected", comment });
  } catch (err) { next(err); }
};

const getMyComments = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const comments = await Comment.find({ author: userId })
      .populate('postId', 'title')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) { next(err); }
};

// --- DELETE & EDIT FUNCTIONS (Required for your feature) ---

const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ msg: "Comment not found" });

    // Allow Author OR Admin
    if (comment.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await Comment.findByIdAndDelete(req.params.id);
    await Comment.deleteMany({ parentCommentId: req.params.id });

    res.json({ msg: "Comment deleted" });
  } catch (err) {
    console.error("Error deleteComment:", err);
    next(err);
  }
};

const editComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ msg: "Comment not found" });

    if (comment.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    comment.text = text;
    comment.status = 'pending';
    await comment.save();

    res.json({ msg: "Comment updated", comment });
  } catch (err) {
    console.error("Error editComment:", err);
    next(err);
  }
};

module.exports = {
  addComment,
  addReply,
  getComments,
  getReplies,
  upvoteComment,
  downvoteComment,
  getUnapprovedComments,
  approveComment,
  rejectComment,
  getMyComments,
  deleteComment, // Ensure this is exported
  editComment    // Ensure this is exported
};