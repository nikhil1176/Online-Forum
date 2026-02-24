// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; 
import { getAllPosts, likePost, downvotePost, deletePost } from "../api/postApi"; 
import PostCard from "../components/PostCard";
import { useAuth } from "../context/AuthContext";
import { 
  PenSquare, 
  TrendingUp, 
  Clock, 
  X,
  Sparkles,
  Github,
  Linkedin,
  Heart,
  Mail,
  CheckCircle, // Added for Success Icon
  AlertCircle  // Added for Error Icon
} from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // To check if we returned from Edit page
  
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState("new");
  
  // ===> 1. ADD TOAST STATE <===
  const [toast, setToast] = useState(null); // { message: "", type: "success" | "error" }

  // ===> 2. HELPER TO SHOW TOAST <===
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000); // Auto-hide after 3 seconds
  };

  useEffect(() => {
    loadPosts();

    // Optional: Check if we returned from Edit page with a success flag
    if (location.state?.message) {
      showToast(location.state.message, "success");
      // Clear state so it doesn't show again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const res = await getAllPosts();
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to load posts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpvote = async (postId) => {
    try {
      const res = await likePost(postId);
      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? res.data : p))
      );
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  const handleDownvote = async (postId) => {
    try {
      const res = await downvotePost(postId);
      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? res.data : p))
      );
    } catch (err) {
      console.error("Downvote failed:", err);
    }
  };

  // ===> 3. UPDATED DELETE HANDLER <===
  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      await deletePost(postId);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      // Trigger Success Alert
      showToast("Post deleted successfully", "success");
    } catch (err) {
      console.error("Delete failed:", err);
      // Trigger Error Alert
      showToast("Failed to delete post", "error");
    }
  };

  const handleEdit = (postId) => {
    navigate(`/edit/${postId}`);
  };

  const sortedPosts = [...posts].sort((a, b) => {
    if (filter === "top") return (b.likes?.length || 0) - (a.likes?.length || 0);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 relative">
      
      {/* ===> 4. TOAST NOTIFICATION UI <=== */}
      {toast && (
        <div className={`fixed top-20 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border transition-all animate-in slide-in-from-right-10 fade-in duration-300 ${
          toast.type === "success" 
            ? "bg-white dark:bg-gray-800 border-green-500 text-green-600 dark:text-green-400" 
            : "bg-white dark:bg-gray-800 border-red-500 text-red-600 dark:text-red-400"
        }`}>
          {toast.type === "success" ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
          <div>
            <h4 className="font-bold text-gray-900 dark:text-gray-100">
              {toast.type === "success" ? "Success" : "Error"}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {toast.message}
            </p>
          </div>
          <button onClick={() => setToast(null)} className="ml-4 text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[80vh]">
        {/* === LEFT COLUMN === */}
        <div className="lg:col-span-3 space-y-6">
          {/* Create Widget */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex gap-4 items-center">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </div>
            <Link 
              to="/create" 
              className="flex-1 bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors rounded-full px-4 py-2.5 text-gray-500 dark:text-gray-400 text-sm font-medium cursor-text"
            >
              What's on your mind, {user?.username || "Guest"}?
            </Link>
            <Link to="/create" className="text-gray-400 hover:text-blue-500 transition-colors">
              <PenSquare size={20} />
            </Link>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-2">
            <button 
              onClick={() => setFilter("new")}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === "new" 
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" 
                  : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              }`}
            >
              <Clock size={16} /> Newest
            </button>
            <button 
              onClick={() => setFilter("top")}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === "top" 
                  ? "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400" 
                  : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              }`}
            >
              <TrendingUp size={16} /> Top Rated
            </button>
          </div>

          {/* Posts Feed */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl h-48 animate-pulse border border-gray-200 dark:border-gray-700">
                   <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                   <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                   <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : sortedPosts.length === 0 ? (
            <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400">No posts yet. Be the first!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedPosts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  currentUser={user}
                  onUpvote={handleUpvote}
                  onDownvote={handleDownvote}
                  onImageClick={setSelectedImage}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          )}
        </div>

        {/* === RIGHT COLUMN === */}
        <div className="hidden lg:block lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 sticky top-24">
            <div className="flex items-center gap-2 mb-3 text-gray-900 dark:text-gray-100 font-bold text-lg">
              <Sparkles className="text-yellow-500" size={20} />
              <span>Community</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              Welcome to your engineering forum. Share projects, ask questions, and collaborate with peers.
            </p>
            <Link 
              to="/create"
              className="mt-4 w-full block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              Create Post
            </Link>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="mt-16 pt-10 pb-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 -mx-4 px-4 lg:-mx-8 lg:px-8 xl:mx-auto xl:px-4 xl:bg-transparent xl:dark:bg-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">ForumX</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                The premier community for engineers to share knowledge, solve problems, and build the future together.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li><a href="#" className="hover:text-blue-500 transition-colors">Trending Posts</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Engineering Tags</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Leaderboard</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Events</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li><a href="#" className="hover:text-blue-500 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Community Guidelines</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-900 hover:text-white transition-all">
                  <Github size={18} />
                </a>
                <a href="mailto:nkanwal.nk@gmail.com" className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-red-500 hover:text-white transition-all">
                  <Mail size={18} />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-blue-700 hover:text-white transition-all">
                  <Linkedin size={18} />
                </a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              &copy; 2024 Engineering Forum Project. All rights reserved.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
              Made with <Heart size={14} className="text-red-500 fill-red-500" /> by Nikhil and Raghav
            </p>
          </div>
        </div>
      </footer>
      
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full max-h-screen flex items-center justify-center">
            <button 
              className="absolute -top-12 right-0 text-white hover:text-gray-300 p-2"
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
            </button>
            <img
              src={selectedImage}
              alt="Full preview"
              className="max-w-full max-h-[90vh] rounded-lg shadow-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}