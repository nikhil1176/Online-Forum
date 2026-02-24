// src/components/CommentSection.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  getCommentsByPost,
  addComment,
  getUnapprovedComments,
  approveComment,
} from "../api/commentApi";
import { useAuth } from "../context/AuthContext";
import CommentItem from "./CommentItem";

export default function CommentSection({ postId }) {
  const { token, user, isAdmin } = useAuth(); 
  
  const [comments, setComments] = useState([]);
  const [pending, setPending] = useState([]);
  const [newText, setNewText] = useState("");
  const [loading, setLoading] = useState(true);
  const commentTextAreaRef = useRef(null); 

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await getCommentsByPost(postId);
        if (!mounted) return;
        setComments(res.data || []);

        if (isAdmin && token) {
          const p = await getUnapprovedComments();
          setPending(p.data || []);
        }
      } catch (err) {
        console.error("Failed to load comments", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [postId, token, isAdmin]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newText.trim()) return;
    if (!token) return alert("Please log in.");

    try {
      const res = await addComment(postId, { text: newText });
      const created = res.data.comment || res.data;
      
      if (created.status === 'approved' || isAdmin) {
        setComments((prev) => [created, ...(prev || [])]);
      } else {
        alert("Comment submitted! It will appear after admin approval.");
      }
      setNewText("");
    } catch (err) {
      console.error("Add comment error", err);
      alert("Failed to add comment");
    }
  };

  const handleReplyAdded = (parentId, replyObj) => {
    if (replyObj.status === 'pending' && !isAdmin) {
       alert("Reply submitted for approval!");
       return;
    }
    // Helper to find parent and append reply
    const addReplyRecursive = (list) => {
      return list.map((c) => {
        if (c._id === parentId) {
          const replies = c.replies ? [replyObj, ...c.replies] : [replyObj];
          return { ...c, replies };
        }
        if (c.replies && c.replies.length > 0) {
          return { ...c, replies: addReplyRecursive(c.replies) };
        }
        return c;
      });
    };
    setComments((prev) => addReplyRecursive(prev));
  };

  // --- FIX: RECURSIVE DELETE (Removes nested replies instantly) ---
  const handleCommentDeleted = (commentId) => {
    const deleteRecursive = (list) => {
      return list
        .filter((c) => c._id !== commentId) // Remove from current level
        .map((c) => {
          // Search deeper if this comment has replies
          if (c.replies && c.replies.length > 0) {
            return { ...c, replies: deleteRecursive(c.replies) };
          }
          return c;
        });
    };

    setComments((prev) => deleteRecursive(prev));
  };

  const handleVoteUpdated = (commentId, updatedComment) => {
     const updateTree = (nodes) =>
      nodes.map((n) => {
        if (n._id === commentId) return { ...n, ...updatedComment };
        if (n.replies?.length) return { ...n, replies: updateTree(n.replies) };
        return n;
      });
    setComments((prev) => updateTree(prev || []));
  };

  const handleApprove = async (id) => {
    try {
      await approveComment(id);
      const approved = pending.find((p) => p._id === id);
      setPending((prev) => prev.filter((p) => p._id !== id));
      if (approved) {
        setComments((prev) => [{ ...approved, status: 'approved' }, ...(prev || [])]);
      }
    } catch (err) {
      alert("Failed to approve");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Input Form */}
      <form onSubmit={handleAddComment} className="mb-6">
        <textarea
          ref={commentTextAreaRef} 
          rows={3}
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Write your comment..."
          className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
        />
        <div className="mt-3 flex justify-end">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Post Comment</button>
        </div>
      </form>

      {/* Admin Pending Section */}
      {isAdmin && pending.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 rounded">
          <h4 className="text-orange-600 font-bold mb-2">⚠️ Pending ({pending.length})</h4>
          {pending.map(p => (
             <div key={p._id} className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded mb-2">
                <span className="text-sm truncate w-2/3 dark:text-gray-200">{p.text}</span>
                <button onClick={() => handleApprove(p._id)} className="text-xs bg-green-600 text-white px-2 py-1 rounded">Approve</button>
             </div>
          ))}
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((c) => (
          <CommentItem 
            key={c._id} 
            item={c} 
            currentUser={user}
            isAdmin={isAdmin} 
            onReplyAdded={handleReplyAdded} 
            onVoteUpdated={handleVoteUpdated}
            onCommentDeleted={handleCommentDeleted} 
          />
        ))}
      </div>
    </div>
  );
}