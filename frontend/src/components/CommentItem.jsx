// src/components/CommentItem.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  addReply, 
  upvoteComment, 
  downvoteComment, 
  deleteComment, 
  editComment 
} from "../api/commentApi";

import { ThumbsUp, ThumbsDown, MessageCircle, Trash2, Edit2, Send, X } from "lucide-react";

export default function CommentItem({ item, currentUser, isAdmin, onReplyAdded, onVoteUpdated, onCommentDeleted }) {
  const { token } = useAuth();
  
  // State for Reply & Edit
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.text);

  // --- ID CHECK ---
  const currentUserId = currentUser?._id?.toString() || currentUser?.id?.toString();
  const authorId = item.author?._id?.toString() || item.author?.toString();
  
  const isOwner = currentUserId && authorId && currentUserId === authorId;
  const canDelete = isOwner || isAdmin;

  const handleVote = async (type) => {
    if (!token) return alert("Please log in to vote");
    try {
      const apiCall = type === 'up' ? upvoteComment : downvoteComment;
      const res = await apiCall(item._id);
      onVoteUpdated(item._id, res.data.comment);
    } catch (err) {
      console.error("Vote failed", err);
    }
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    try {
      const res = await addReply(item._id, { text: replyText });
      const newReply = res.data.reply || res.data;
      if (!newReply) throw new Error("No reply data received");

      onReplyAdded(item._id, newReply);
      setReplyText("");
      setShowReply(false);
    } catch (err) {
      console.error("Reply failed", err);
      alert("Failed to post reply.");
    }
  };

  // --- UPDATED DELETE WITH ALERT ---
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      await deleteComment(item._id);
      alert("Comment deleted successfully!"); // <--- Alert added
      onCommentDeleted(item._id);
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete comment");
    }
  };

  // --- UPDATED EDIT WITH ALERT ---
  const handleEditSubmit = async () => {
    if (!editText.trim()) return;
    try {
      await editComment(item._id, editText);
      alert("Comment edited successfully! Pending admin approval."); // <--- Alert added
      onCommentDeleted(item._id); 
      setIsEditing(false);
    } catch (err) {
      console.error("Edit failed", err);
      alert("Failed to update comment");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 mb-3">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-xs">
              {item.author?.username?.[0]?.toUpperCase() || "U"}
           </div>
           <div>
             <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">{item.author?.username}</span>
             <span className="text-xs text-gray-500 ml-2">{new Date(item.createdAt).toLocaleDateString()}</span>
           </div>
        </div>

        {/* Buttons */}
        {canDelete && !isEditing && (
          <div className="flex gap-2">
            {isOwner && (
              <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-blue-500" title="Edit">
                <Edit2 size={16} />
              </button>
            )}
            <button onClick={handleDelete} className="text-gray-400 hover:text-red-500" title="Delete">
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {isEditing ? (
        <div className="mt-2">
          <textarea 
            value={editText} 
            onChange={(e) => setEditText(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          <div className="flex gap-2 mt-2 justify-end">
            <button onClick={() => setIsEditing(false)} className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white">
              <X size={14} /> Cancel
            </button>
            <button onClick={handleEditSubmit} className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
              <Send size={14} /> Save
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 whitespace-pre-wrap">{item.text}</p>
      )}

      {/* Footer */}
      {!isEditing && (
        <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 text-sm">
          <button onClick={() => handleVote('up')} className="flex items-center gap-1 hover:text-blue-500">
            <ThumbsUp size={14} /> {item.upvotes?.length || 0}
          </button>
          <button onClick={() => handleVote('down')} className="flex items-center gap-1 hover:text-red-500">
            <ThumbsDown size={14} /> {item.downvotes?.length || 0}
          </button>
          <button onClick={() => setShowReply(!showReply)} className="flex items-center gap-1 hover:text-blue-500">
            <MessageCircle size={14} /> Reply
          </button>
        </div>
      )}

      {/* Reply Box */}
      {showReply && (
        <div className="mt-3 ml-4 border-l-2 pl-3 border-gray-200 dark:border-gray-700">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            className="w-full p-2 border rounded text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
            rows={2}
          />
          <button onClick={handleSubmitReply} className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700">
            Post Reply
          </button>
        </div>
      )}

      {/* Nested Replies */}
      {item.replies && item.replies.length > 0 && (
        <div className="mt-4 pl-4 border-l-2 border-gray-100 dark:border-gray-700 space-y-3">
          {item.replies.map(reply => (
             <CommentItem 
                key={reply._id} 
                item={reply} 
                currentUser={currentUser}
                isAdmin={isAdmin}
                onReplyAdded={onReplyAdded}
                onVoteUpdated={onVoteUpdated}
                onCommentDeleted={onCommentDeleted}
             />
          ))}
        </div>
      )}
    </div>
  );
}