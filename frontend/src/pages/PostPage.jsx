import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPost } from "../api/postApi";
import CommentSection from "../components/CommentSection";

export default function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await getPost(id);
      setPost(res.data);
    })();
  }, [id]);

  if (!post) return <p className="text-center mt-6 dark:text-gray-300">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        {post.title}
      </h1>

      {post.imageUrl && (
        <img src={post.imageUrl} alt="" className="w-full rounded-lg shadow" />
      )}

      <p className="text-gray-800 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
        {post.content}
      </p>

      <hr className="border-gray-300 dark:border-gray-700" />

      <CommentSection postId={id} />
    </div>
  );
}
