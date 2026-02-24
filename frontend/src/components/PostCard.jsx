// src/components/PostCard.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle, 
  Share2, 
  MoreHorizontal,
  Trash2,
  Pencil
} from "lucide-react";

export default function PostCard({ 
  post, 
  currentUser, 
  onUpvote, 
  onDownvote, 
  onImageClick, 
  onDelete, 
  onEdit 
}) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const upvoteScore = post.likes?.length || 0;
  const downvoteScore = post.dislikes?.length || 0;

  // Check if current user is the author
  // We use optional chaining (?.) just in case user is not logged in
  const isAuthor = currentUser?._id === post.author?._id || currentUser?.id === post.author?._id;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Just now";
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short', day: 'numeric'
    });
  };

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 overflow-visible mb-4 relative">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xs font-bold uppercase select-none">
            {post.author?.username?.charAt(0) || "U"}
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-0 md:gap-2 text-xs">
            <span className="font-semibold text-gray-900 dark:text-gray-100 hover:underline cursor-pointer">
              @{post.author?.username || "unknown"}
            </span>
            <span className="hidden md:inline text-gray-400">•</span>
            <span className="text-gray-500 dark:text-gray-400">
              {formatDate(post.createdAt)}
            </span>
          </div>
        </div>

        {/* === ACTION MENU (Only for Author) === */}
        {isAuthor && (
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
            >
              <MoreHorizontal size={18} />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 top-8 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 py-1 overflow-hidden">
                <button
                  onClick={() => { setShowMenu(false); onEdit(post._id); }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                  onClick={() => { setShowMenu(false); onDelete(post._id); }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 py-2">
        <Link to={`/posts/${post._id}`} className="block group-hover:opacity-100">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-2 leading-snug hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {post.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3 mb-3">
            {post.content}
          </p>
        </Link>
        {post.imageUrl && (
          <div 
            className="mt-2 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 cursor-pointer"
            onClick={() => onImageClick(post.imageUrl)}
          >
            <img
              src={post.imageUrl}
              alt="Post content"
              className="w-full max-h-[500px] object-cover hover:scale-[1.01] transition-transform duration-300"
              loading="lazy"
            />
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="px-4 pb-4 pt-2 flex items-center gap-2">
        <div className="flex items-center bg-gray-100 dark:bg-gray-700/50 rounded-full border border-transparent dark:border-gray-700 overflow-hidden">
          <button
            onClick={(e) => { e.stopPropagation(); onUpvote(post._id); }}
            className="flex items-center gap-1 p-1.5 pl-3 pr-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/30 transition-colors"
            title="Like"
          >
            <ThumbsUp size={18} />
            <span className="text-sm font-bold">{upvoteScore}</span>
          </button>
          
          <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
          
          <button
            onClick={(e) => { e.stopPropagation(); onDownvote(post._id); }}
            className="flex items-center gap-1 p-1.5 pr-3 pl-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/30 transition-colors"
            title="Dislike"
          >
            <ThumbsDown size={18} />
            {downvoteScore > 0 && (
              <span className="text-sm font-bold">{downvoteScore}</span>
            )}
          </button>
        </div>

        <Link
          to={`/posts/${post._id}`}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/50 rounded-full transition-colors"
        >
          <MessageCircle size={18} />
          <span>Comments</span>
        </Link>

        <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/50 rounded-full transition-colors ml-auto">
          <Share2 size={18} />
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>
    </div>
  );
}