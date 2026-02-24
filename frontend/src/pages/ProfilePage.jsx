// src/pages/ProfilePage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import { Link } from 'react-router-dom';
import { Trash2, ExternalLink } from 'lucide-react'; // Icons
import { deletePost } from '../api/postApi';       // Ensure this exists
import { deleteComment } from '../api/commentApi'; // Ensure this exists

const StatusBadge = ({ status }) => {
  let colorClass = '';
  switch (status) {
    case 'approved':
      colorClass = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border border-green-200 dark:border-green-800';
      break;
    case 'rejected':
      colorClass = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border border-red-200 dark:border-red-800';
      break;
    default:
      // Pending
      colorClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800';
  }
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${colorClass} capitalize`}>
      {status}
    </span>
  );
};

export default function ProfilePage() {
  const { user, loading } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [view, setView] = useState('posts');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [postsRes, commentsRes] = await Promise.all([
          axiosClient.get('/posts/my-posts'),
          axiosClient.get('/comments/my-comments'),
        ]);
        setPosts(postsRes.data);
        setComments(commentsRes.data);
      } catch (err) {
        console.error('Profile load error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [user]);

  // --- DELETE HANDLERS ---
  const handleDeletePost = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert("Failed to delete post");
    }
  };

  const handleDeleteComment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      await deleteComment(id);
      setComments((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert("Failed to delete comment");
    }
  };

  if (loading || isLoading)
    return <p className="p-4 text-gray-600 dark:text-gray-300">Loading profile...</p>;

  if (!user)
    return <p className="p-4 text-gray-600 dark:text-gray-300">Please login to view profile.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{user.username}'s Profile</h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-300 dark:border-gray-700 mb-6">
        <button
          className={`py-2 px-4 mr-2 transition-colors ${
            view === 'posts'
              ? 'border-b-2 border-blue-500 font-semibold text-blue-600 dark:text-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
          onClick={() => setView('posts')}
        >
          Posts ({posts.length})
        </button>

        <button
          className={`py-2 px-4 transition-colors ${
            view === 'comments'
              ? 'border-b-2 border-blue-500 font-semibold text-blue-600 dark:text-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
          onClick={() => setView('comments')}
        >
          Comments ({comments.length})
        </button>
      </div>

      {/* POSTS VIEW */}
      {view === 'posts' && (
        <div className="space-y-4">
          {posts.length === 0 && <p className="text-gray-500 italic">No posts created yet.</p>}
          {posts.map((post) => (
            <div key={post._id} className="p-4 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 shadow-sm flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {post.status === 'approved' ? (
                    <Link to={`/posts/${post._id}`} className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                      {post.title} <ExternalLink size={14} />
                    </Link>
                  ) : (
                    <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">{post.title}</span>
                  )}
                  <StatusBadge status={post.status} />
                </div>
                <div className="text-xs text-gray-500">
                  Created: {new Date(post.createdAt).toLocaleDateString()}
                </div>
                {post.status === 'rejected' && post.remarks && (
                  <p className="text-xs text-red-600 mt-2 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                    <strong>Reason:</strong> {post.remarks}
                  </p>
                )}
              </div>
              
              <button 
                onClick={() => handleDeletePost(post._id)} 
                className="text-gray-400 hover:text-red-600 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                title="Delete Post"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* COMMENTS VIEW */}
      {view === 'comments' && (
        <div className="space-y-4">
          {comments.length === 0 && <p className="text-gray-500 italic">No comments made yet.</p>}
          {comments.map((comment) => (
            <div key={comment._id} className="p-4 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 shadow-sm flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                   <StatusBadge status={comment.status} />
                   <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                
                <div className="text-gray-800 dark:text-gray-200 font-medium mb-2 p-2 bg-gray-50 dark:bg-gray-900 rounded border dark:border-gray-700">
                  "{comment.text}"
                </div>
                
                <div className="text-sm text-gray-500 dark:text-gray-400">
                   On Post:{" "}
                   {comment.postId ? (
                     <Link to={`/posts/${comment.postId._id}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                       {comment.postId.title}
                     </Link>
                   ) : (
                     <span className="italic text-red-400">Post Deleted</span>
                   )}
                </div>

                {comment.status === 'rejected' && comment.remarks && (
                  <p className="text-xs text-red-600 mt-2 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                    <strong>Reason:</strong> {comment.remarks}
                  </p>
                )}
              </div>

              <button 
                onClick={() => handleDeleteComment(comment._id)} 
                className="text-gray-400 hover:text-red-600 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition self-center"
                title="Delete Comment"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}