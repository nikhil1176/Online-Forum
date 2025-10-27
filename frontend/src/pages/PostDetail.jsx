import React, { useEffect, useState } from "react";
import { getPost } from "../api/postApi";
import { useParams } from "react-router-dom";
import CommentSection from "../components/CommentSection";

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getPost(id);
        setPost(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [id]);

  if (!post) return <div>Loading...</div>;

  return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-400">
          <h2 className="text-3xl font-bold mb-3 text-gray-800">{post.title}</h2>
          <p className="text-gray-700 mb-4 whitespace-pre-line">{post.body}</p>
          <small className="text-sm text-gray-600 mt-1">By {post.author?.username}</small>
        </div>
        <CommentSection postId={post._id} />
      </div>
    );
  }
