// File: controllers/postController.js
const Post = require("../models/Posts");

// --- 1. THIS IS THE FUNCTION THAT WAS BROKEN ---
// Get All Posts
const getPosts = async (req, res) => {
  try {
    // This finds all posts, sorts them by newest first,
    // and populates the 'author' field with their 'username'
    const posts = await Post.find()
      .populate("author", "username")
      .sort({ createdAt: -1 }); // Sort by newest
      
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- 2. YOUR OTHER FUNCTIONS (ALREADY CORRECT) ---

// Get Single Post
const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username email");
      
    if (!post) return res.status(404).json({ msg: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create Post
const createPost = async (req, res) => {
  try {
    const { title, content } = req.body; 

    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const post = await Post.create({
      title,
      content,
      imageUrl: imageUrl, 
      author: req.user.id,
    });
    
    res.status(201).json(post);
  } catch (err) {
    console.error("CREATE POST FAILED:", err.message);
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

    if (post.upvotes.includes(userId)) {
      post.upvotes = post.upvotes.filter(id => id.toString() !== userId);
    } else {
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

    if (post.downvotes.includes(userId)) {
      post.downvotes = post.downvotes.filter(id => id.toString() !== userId);
    } else {
      post.upvotes = post.upvotes.filter(id => id.toString() !== userId);
      post.downvotes.push(userId);
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// --- 3. YOUR EXPORTS (ALL FUNCTIONS INCLUDED) ---
module.exports = { 
  createPost, 
  getPosts, 
  getPost, 
  upvotePost, 
  downvotePost 
};