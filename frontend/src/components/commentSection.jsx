import React, { useState, useEffect, useContext } from "react";
import { getCommentsByPost, addComment } from "../api/commentApi";
import { AuthContext } from "../context/AuthContext";

const PencilIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
  </svg>
);

const PaperPlaneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const SparkleIcon = () => (
  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v.01M12 21v.01M3 12h.01M21 12h.01M5.64 5.64l.01.01M18.36 18.36l.01.01M5.64 18.36l.01-.01M18.36 5.64l.01-.01" />
  </svg>
);

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const load = async () => {
      const res = await getCommentsByPost(postId);
      setComments(res.data || []);
    };
    load();
  }, [postId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await addComment(postId, { text }, token);
      const res = await getCommentsByPost(postId);
      setComments(res.data || []);
      setText("");
    } catch (err) {
      console.error(err);
      alert("Failed to add comment");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">Comments</h4>

      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((c) => (
            <div key={c._id} className="border-t border-gray-200 pt-3">
              <p className="text-sm font-medium text-gray-700">
                {c.author?.username || "Anon"}
              </p>
              <p className="text-gray-600">{c.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No comments yet. Be the first!</p>
      )}

      <form onSubmit={handleAdd} className="mt-5 space-y-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder="Write a comment..."
          className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-2 mt-3 text-white font-semibold rounded-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
        >
          <span>Post Comment</span>
          <PaperPlaneIcon />
        </button>
        {!token && (
          <p className="text-sm text-gray-500">Login to comment</p>
        )}
      </form>
    </div>
  );
}