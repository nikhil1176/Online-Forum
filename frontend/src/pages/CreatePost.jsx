// src/pages/CreatePost.jsx
import React, { useState, useContext } from "react";
import { createPost, uploadImage } from "../api/postApi";
import { AuthContext } from "../context/AuthContext";
import { PendingPostContext } from "../context/PendingPostContext";
import { useNavigate } from "react-router-dom";
import { UploadCloud, Send, CheckCircle, Loader2 } from "lucide-react"; // Optional icons if you have them

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  
  // New state for detailed loading status
  const [status, setStatus] = useState("idle"); // idle, uploading, creating, success

  const { user, isAdmin } = useContext(AuthContext);
  const { fetchPendingCount } = useContext(PendingPostContext);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please log in.");

    try {
      let imageUrl = null;

      // STEP 1: Upload Image (if exists)
      if (file) {
        setStatus("uploading"); // Show "Uploading..."
        const uploadRes = await uploadImage(file);
        imageUrl = uploadRes.data.imageUrl;
      }

      // STEP 2: Create Post
      setStatus("creating"); // Show "Publishing..."
      await createPost({ title, content, imageUrl });
      
      // Refresh pending count in background (don't await strictly if not needed)
      fetchPendingCount();

      // STEP 3: Handle Success
      setStatus("success");
      
      if (!isAdmin) {
        setMessage("Post submitted! Waiting for approval...");
        // Faster redirect for better UX
        setTimeout(() => nav("/"), 1500);
      } else {
        // Admins go back instantly
        nav("/");
      }

    } catch (err) {
      console.error(err);
      alert("Post creation failed. Please try again.");
      setStatus("idle");
    }
  };

  // Helper to determine button text and icon
  const getButtonContent = () => {
    switch (status) {
      case "uploading": return <><Loader2 className="animate-spin" size={18} /> Uploading Image...</>;
      case "creating":  return <><Loader2 className="animate-spin" size={18} /> Publishing...</>;
      case "success":   return <><CheckCircle size={18} /> Success!</>;
      default:          return <><Send size={18} /> Create Post</>;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md mt-6 text-gray-900 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
      <form onSubmit={submit} className="space-y-5">
        <h2 className="text-2xl font-bold border-b pb-2 dark:border-gray-700">Create New Post</h2>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Title</label>
          <input
            className="w-full p-3 rounded bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="What's on your mind?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Content</label>
          <textarea
            className="w-full p-3 h-40 rounded bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Share your thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Image (Optional)</label>
          <div className="flex items-center gap-2">
            <label className="cursor-pointer flex items-center gap-2 bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition">
              <UploadCloud size={20} />
              <span className="text-sm">{file ? file.name.substring(0, 15) + "..." : "Choose Image"}</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            {file && (
              <button 
                type="button" 
                onClick={() => setFile(null)} 
                className="text-red-500 text-xs hover:underline"
              >
                Remove
              </button>
            )}
          </div>
        </div>

        <button
          type="submit"
          className={`w-full flex items-center justify-center gap-2 p-3 rounded font-medium text-white transition-all ${
            status === 'success' ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"
          } ${status !== 'idle' ? "opacity-80 cursor-not-allowed" : ""}`}
          disabled={status !== "idle"}
        >
          {getButtonContent()}
        </button>

        {message && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-center rounded">
            {message}
          </div>
        )}
      </form>
    </div>
  );
}