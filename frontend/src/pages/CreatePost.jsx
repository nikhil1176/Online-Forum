import React, { useState } from "react";
import { createPost } from "../api/postApi";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function CreatePost() {
  const [title, setTitle] = useState("");  
  const [content, setContent] = useState(""); 
  const [image, setImage] = useState(null);
  const nav = useNavigate();

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content); 
      formData.append("image", image); 

      await createPost(formData);
      nav("/");
    } catch (err) {
      console.error(err);
      alert("Failed to create post. Check console and server logs.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
    <form onSubmit={submit} className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Create Post</h2>

      <label htmlFor="title">Title</label>
      <input
        id="title"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
        required
      />

      
      <label htmlFor="content">Body</label>
      <textarea
        id="content"
        placeholder="Body" 
        value={content} 
        onChange={(e) => setContent(e.target.value)} 
        className="w-full border border-gray-300 rounded-md p-2 h-40 focus:ring-2 focus:ring-blue-500 outline-none"
        required
      />

      
      <input
        id="image"
        type="file"
        accept=".jpg,.jpeg,.png"
        onChange={handleFileChange}
        className="w-full border border-gray-300 rounded-md p-2 h-40 focus:ring-2 focus:ring-blue-500 outline-none"
        required
      />
      <label htmlFor="image">Image (jpg, png, jpeg)</label>
      <br />

      <button type="submit"  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition">Create</button>
    </form>
  </div>
  );
}