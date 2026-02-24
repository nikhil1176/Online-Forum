// controllers/postController.js
const Post = require("../models/Posts");
const Comment = require("../models/Comment");

// GET ALL APPROVED POSTS
const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ status: "approved" })
      .populate("author", "username _id")
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json(posts);
  } catch (err) {
    console.error("getPosts error:", err);
    next(err);
  }
};

// GET SINGLE APPROVED POST
const getPost = async (req, res, next) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      status: "approved",
    }).populate("author", "username _id email");

    if (!post) {
      return res.status(404).json({ msg: "Post not found or not approved" });
    }

    res.json(post);
  } catch (err) {
    console.error("getPost error:", err);
    next(err);
  }
};

// CREATE POST
const createPost = async (req, res, next) => {
  try {
    const { title, content, imageUrl } = req.body;
    const user = req.user;

    // Fail fast validation
    if (!title || !content) {
      return res.status(400).json({ msg: "Title and Content are required" });
    }
    if (!user) return res.status(401).json({ msg: "Unauthorized" });

    const isAdmin = user.role === "admin";

    // Direct creation - highly efficient
    const post = await Post.create({
      title,
      content,
      imageUrl: imageUrl || null,
      author: user.id,
      status: isAdmin ? "approved" : "pending",
    });

    return res.status(201).json({
      msg: isAdmin ? "Post approved" : "Post submitted for approval",
      post,
    });
  } catch (err) {
    console.error("createPost error:", err);
    next(err);
  }
};

// LIKE POST (Toggle)
const likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    const userId = req.user.id;
    if (!post.likes) post.likes = [];
    if (!post.dislikes) post.dislikes = [];

    const likeIndex = post.likes.indexOf(userId);
    const dislikeIndex = post.dislikes.indexOf(userId);

    if (likeIndex !== -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(userId);
      if (dislikeIndex !== -1) post.dislikes.splice(dislikeIndex, 1);
    }

    await post.save();
    const updated = await Post.findById(req.params.id).populate("author", "username");
    res.json(updated);
  } catch (err) { next(err); }
};

// DOWNVOTE POST (Toggle)
const downvotePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    const userId = req.user.id;
    if (!post.likes) post.likes = [];
    if (!post.dislikes) post.dislikes = [];

    const likeIndex = post.likes.indexOf(userId);
    const dislikeIndex = post.dislikes.indexOf(userId);

    if (dislikeIndex !== -1) {
      post.dislikes.splice(dislikeIndex, 1);
    } else {
      post.dislikes.push(userId);
      if (likeIndex !== -1) post.likes.splice(likeIndex, 1);
    }

    await post.save();
    const updated = await Post.findById(req.params.id).populate("author", "username");
    res.json(updated);
  } catch (err) { next(err); }
};

// DELETE POST
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await Comment.deleteMany({ postId: post._id });
    await Post.findByIdAndDelete(req.params.id);

    res.json({ msg: "Post removed" });
  } catch (err) { next(err); }
};

// UPDATE POST
const updatePost = async (req, res, next) => {
  try {
    const { title, content, imageUrl } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ msg: "Post not found" });

    if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ msg: "Not authorized" });
    }

    post.title = title;
    post.content = content;
    if (imageUrl) post.imageUrl = imageUrl;

    const updated = await post.save();
    res.json(updated);
  } catch (err) { next(err); }
};

// ADMIN: GET UNAPPROVED
const getUnapprovedPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ status: "pending" })
      .populate("author", "username email")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) { next(err); }
};

// ADMIN: GET COUNT
const getUnapprovedCount = async (req, res, next) => {
  try {
    const count = await Post.countDocuments({ status: "pending" });
    res.json({ count });
  } catch (err) { next(err); }
};

// ADMIN: APPROVE
const approvePost = async (req, res, next) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, { status: "approved", remarks: "" });
    res.json({ msg: "Post approved" });
  } catch (err) { next(err); }
};

// ADMIN: REJECT
const rejectPost = async (req, res, next) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, { status: "rejected", remarks: req.body.remarks });
    res.json({ msg: "Post rejected" });
  } catch (err) { next(err); }
};

// GET MY POSTS
const getMyPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ author: req.user.id }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) { next(err); }
};

module.exports = {
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
};