// src/pages/AdminDashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import axiosClient from "../api/axiosClient";
import { PendingPostContext } from "../context/PendingPostContext";
import { Link } from "react-router-dom";
import { getUnapprovedComments, approveComment, rejectComment } from "../api/commentApi";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"; // Import icons

export default function AdminDashboard() {
  // --- POST STATE ---
  const [posts, setPosts] = useState([]);
  const [rejectId, setRejectId] = useState(null);
  const [rejectRemark, setRejectRemark] = useState("");
  
  // --- COMMENT STATE ---
  const [comments, setComments] = useState([]);
  const [rejectCommentId, setRejectCommentId] = useState(null);
  const [rejectCommentRemark, setRejectCommentRemark] = useState("");

  const [loading, setLoading] = useState(true);
  const { fetchPendingCount } = useContext(PendingPostContext);

  // --- ALERT STATE (New) ---
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });

  // Helper to show alert
  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    // Hide after 3 seconds
    setTimeout(() => setAlert({ show: false, message: "", type: "success" }), 3000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [postsRes, commentsRes] = await Promise.all([
        axiosClient.get("/posts/admin/unapproved"),
        getUnapprovedComments()
      ]);
      setPosts(postsRes.data);
      setComments(commentsRes.data || []);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- POST HANDLERS ---
  const approvePost = async (id) => {
    try {
      await axiosClient.put(`/posts/admin/${id}/approve`);
      setPosts(posts.filter((p) => p._id !== id));
      fetchPendingCount();
      showAlert("Post approved successfully! ✅"); // <--- Alert
    } catch (err) {
      showAlert("Failed to approve post", "error");
    }
  };

  const rejectPostSubmit = async () => {
    try {
      await axiosClient.put(`/posts/admin/${rejectId}/reject`, {
        remarks: rejectRemark,
      });
      setPosts(posts.filter((p) => p._id !== rejectId));
      fetchPendingCount();
      setRejectId(null);
      setRejectRemark("");
      showAlert("Post rejected successfully. ❌"); // <--- Alert
    } catch (err) {
      showAlert("Failed to reject post", "error");
    }
  };

  // --- COMMENT HANDLERS ---
  const handleApproveComment = async (id) => {
    try {
      await approveComment(id);
      setComments((prev) => prev.filter((c) => c._id !== id));
      fetchPendingCount();
      showAlert("Comment approved successfully! ✅"); // <--- Alert
    } catch (err) {
      console.error(err);
      showAlert("Failed to approve comment", "error");
    }
  };

  const handleRejectCommentSubmit = async () => {
    if (!rejectCommentRemark.trim()) return;
    try {
      await rejectComment(rejectCommentId, rejectCommentRemark);
      setComments((prev) => prev.filter((c) => c._id !== rejectCommentId));
      fetchPendingCount();
      setRejectCommentId(null);
      setRejectCommentRemark("");
      showAlert("Comment rejected successfully. ❌"); // <--- Alert
    } catch (err) {
      console.error(err);
      showAlert("Failed to reject comment", "error");
    }
  };

  if (loading) return <p className="p-4 text-gray-700 dark:text-gray-300">Loading admin dashboard...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 text-gray-900 dark:text-gray-100 relative">
      
      {/* --- FLOATING ALERT COMPONENT --- */}
      {alert.show && (
        <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg border flex items-center gap-2 animate-bounce-short ${
          alert.type === "error" 
            ? "bg-red-100 border-red-400 text-red-700 dark:bg-red-900 dark:text-red-100" 
            : "bg-green-100 border-green-400 text-green-700 dark:bg-green-900 dark:text-green-100"
        }`}>
          {alert.type === "error" ? <XCircle size={20} /> : <CheckCircle size={20} />}
          <span className="font-medium">{alert.message}</span>
        </div>
      )}

      <h2 className="text-3xl font-bold border-b pb-2 dark:border-gray-700">Admin Dashboard</h2>

      {/* ======================= */}
      {/* PENDING POSTS SECTION */}
      {/* ======================= */}
      <section>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
           📄 Pending Posts 
           <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">{posts.length}</span>
        </h3>
        
        {posts.length === 0 ? (
          <p className="text-gray-500 italic">No pending posts.</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post._id} className="p-4 border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 shadow-sm transition hover:shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-semibold">{post.title}</h4>
                    <p className="text-sm text-gray-500 mb-2">By: {post.author?.username || "Unknown"}</p>
                  </div>
                  <Link to={`/posts/${post._id}`} className="text-blue-600 dark:text-blue-400 text-sm hover:underline">View Post</Link>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 line-clamp-2 mb-3">{post.content}</p>

                <div className="flex gap-3">
                  <button onClick={() => approvePost(post._id)} className="bg-green-600 px-3 py-1.5 text-white rounded hover:bg-green-700 transition flex items-center gap-1">
                    Approve
                  </button>
                  <button onClick={() => setRejectId(post._id)} className="bg-red-600 px-3 py-1.5 text-white rounded hover:bg-red-700 transition flex items-center gap-1">
                    Reject
                  </button>
                </div>

                {/* Reject Input for Posts */}
                {rejectId === post._id && (
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 animate-fade-in">
                    <textarea
                      className="border p-2 w-full rounded dark:bg-gray-800 dark:text-white dark:border-gray-500 focus:ring-2 focus:ring-red-500"
                      placeholder="Reason for rejection..."
                      value={rejectRemark}
                      onChange={(e) => setRejectRemark(e.target.value)}
                    />
                    <div className="flex gap-2 mt-2">
                      <button onClick={rejectPostSubmit} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Confirm Reject</button>
                      <button onClick={() => setRejectId(null)} className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ========================== */}
      {/* PENDING COMMENTS SECTION */}
      {/* ========================== */}
      <section>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
           💬 Pending Comments 
           <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">{comments.length}</span>
        </h3>

        {comments.length === 0 ? (
          <p className="text-gray-500 italic">No pending comments.</p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment._id} className="p-4 border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 shadow-sm transition hover:shadow-md">
                <div className="flex justify-between items-start mb-2">
                   <div>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{comment.author?.username || "User"}</span>
                      <span className="text-gray-500 mx-2 text-sm">commented on:</span> 
                      <Link to={`/posts/${comment.postId?._id || comment.postId}`} className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                        {comment.postId?.title || "View Post"}
                      </Link>
                   </div>
                   <span className="text-xs text-orange-600 font-bold bg-orange-100 px-2 py-1 rounded border border-orange-200">Pending Edit</span>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded text-gray-800 dark:text-gray-200 mb-3 border dark:border-gray-700 italic">
                  "{comment.text}"
                </div>

                <div className="flex gap-3">
                  <button onClick={() => handleApproveComment(comment._id)} className="bg-green-600 px-3 py-1.5 text-white rounded hover:bg-green-700 transition">Approve</button>
                  <button onClick={() => setRejectCommentId(comment._id)} className="bg-red-600 px-3 py-1.5 text-white rounded hover:bg-red-700 transition">Reject</button>
                </div>

                {/* Reject Input for Comments */}
                {rejectCommentId === comment._id && (
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 animate-fade-in">
                    <textarea
                      className="border p-2 w-full rounded dark:bg-gray-800 dark:text-white dark:border-gray-500 focus:ring-2 focus:ring-red-500"
                      placeholder="Reason for rejection..."
                      value={rejectCommentRemark}
                      onChange={(e) => setRejectCommentRemark(e.target.value)}
                    />
                    <div className="flex gap-2 mt-2">
                      <button onClick={handleRejectCommentSubmit} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Confirm Reject</button>
                      <button onClick={() => setRejectCommentId(null)} className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}