import React, { useEffect, useState } from "react";
import { getAllPosts } from "../api/postApi";
import PostCard from "../components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAllPosts();
        setPosts(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">All Posts</h2>
      {posts.length === 0 ? (
        <p className="text-gray-500">No posts yet. Be the first to share!</p>
      ) : (
        <div className="space-y-4">
          {posts.map((p) => (
            <PostCard key={p._id} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}