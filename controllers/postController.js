const Post = require("../models/Posts");

// Create Post
const createPost = async (req, res) => {
  try {
    // Add this line to see what data the server receives
    console.log("Request Body:", req.body);

    const post = await Post.create({ ...req.body, author: req.user.id });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Posts
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "username email");
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Single Post
const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "username email");
    if (!post) return res.status(404).json({ msg: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Upvote a Post
const upvotePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    // Check if user already upvoted
    if (post.upvotes.includes(userId)) {
      post.upvotes = post.upvotes.filter(id => id.toString() !== userId);
    } else {
      // Remove downvote if it exists
      post.downvotes = post.downvotes.filter(id => id.toString() !== userId);
      post.upvotes.push(userId);
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Downvote a Post
const downvotePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    // Check if user already downvoted
    if (post.downvotes.includes(userId)) {
      post.downvotes = post.downvotes.filter(id => id.toString() !== userId);
    } else {
      // Remove upvote if it exists
      post.upvotes = post.upvotes.filter(id => id.toString() !== userId);
      post.downvotes.push(userId);
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



module.exports = { createPost, getPosts, getPost,upvotePost,downvotePost };
