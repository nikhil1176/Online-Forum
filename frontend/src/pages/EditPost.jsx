// src/pages/EditPost.jsx
import React, { useState, useEffect } from "react";
import { getPost, updatePost, uploadImage } from "../api/postApi";
import { useNavigate, useParams } from "react-router-dom";
import { UploadCloud, Loader2, Save, CheckCircle, Image as ImageIcon } from "lucide-react";

export default function EditPost() {
  const { id } = useParams();
  const nav = useNavigate();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [file, setFile] = useState(null);
  
  // New UI states
  const [status, setStatus] = useState("idle"); // idle, uploading, updating, success
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await getPost(id);
        setTitle(res.data.title);
        setContent(res.data.content);
        setCurrentImage(res.data.imageUrl);
      } catch {
        nav("/");
      }
    })();
  }, [id, nav]);

  const submit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = currentImage;

      // 1. Upload new image if selected
      if (file) {
        setStatus("uploading");
        const uploadRes = await uploadImage(file);
        imageUrl = uploadRes.data.imageUrl;
      }

      // 2. Update Post
      setStatus("updating");
      await updatePost(id, { title, content, imageUrl });

      // 3. Success Feedback
      setStatus("success");
      setMessage("Post updated successfully! Redirecting...");

      // 4. Redirect after delay
      setTimeout(() => {
        nav(`/posts/${id}`);
      }, 1500);

    } catch (err) {
      console.error(err);
      alert("Update failed. Please try again.");
      setStatus("idle");
    }
  };

  // Helper for button label
  const getButtonLabel = () => {
    switch(status) {
      case "uploading": return <><Loader2 className="animate-spin" size={18} /> Uploading Image...</>;
      case "updating": return <><Loader2 className="animate-spin" size={18} /> Updating Post...</>;
      case "success": return <><CheckCircle size={18} /> Success!</>;
      default: return <><Save size={18} /> Save Changes</>;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md mt-8 border border-gray-200 dark:border-gray-700">
      <form onSubmit={submit} className="space-y-5">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 border-b pb-2 dark:border-gray-700">
          Edit Post
        </h2>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Title</label>
          <input 
            className="w-full p-3 rounded bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            value={title} 
            onChange={(e)=>setTitle(e.target.value)} 
            placeholder="Post Title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Content</label>
          <textarea 
            className="w-full p-3 h-40 rounded bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            value={content} 
            onChange={(e)=>setContent(e.target.value)} 
            placeholder="Post Content"
            required
          />
        </div>

        {/* Image Preview & Upload */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Post Image</label>
          
          {currentImage && !file && (
            <div className="mb-3 relative group">
               <img src={currentImage} alt="Current" className="h-40 rounded object-cover border dark:border-gray-600" />
               <p className="text-xs text-gray-500 mt-1">Current Image</p>
            </div>
          )}

          <div className="flex items-center gap-3">
             <label className="cursor-pointer flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <UploadCloud size={18} className="text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-gray-700 dark:text-gray-200">
                  {file ? "Change Image" : "Replace Image"}
                </span>
                <input type="file" className="hidden" onChange={(e)=>setFile(e.target.files[0])} accept="image/*" />
             </label>
             {file && <span className="text-sm text-gray-600 dark:text-gray-400">{file.name}</span>}
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={status !== "idle"}
          className={`w-full flex items-center justify-center gap-2 p-3 rounded font-medium text-white transition-all ${
            status === 'success' ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"
          } ${status !== 'idle' ? "opacity-80 cursor-not-allowed" : ""}`}
        >
          {getButtonLabel()}
        </button>

        {/* Success Message Alert */}
        {message && (
          <div className="p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-center rounded animate-pulse">
            {message}
          </div>
        )}
      </form>
    </div>
  );
}