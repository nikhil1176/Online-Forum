import React from "react";
import { Link } from "react-router-dom";

const BACKEND_URL = "http://localhost:5000";

export default function PostCard({ post }) {
  const imageUrl = post.imageUrl ? `${BACKEND_URL}${post.imageUrl}` : null;

  
  const cardStyle = {
    border: "1px solid #ddd",
    borderRadius: "8px",
    overflow: "hidden", 
    display: "flex",
    flexDirection: "column",
    height: "100%", 
  };

  const imageStyle = {
    width: "100%",
    height: "200px", 
    objectFit: "cover", 
  };

  const contentStyle = {
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1, 
  };

  const titleStyle = {
    marginTop: 0,
    marginBottom: "8px",
  };

  const textStyle = {
    fontSize: "0.9em",
    color: "#666",
    flexGrow: 1, 
  };

  const authorStyle = {
    fontSize: "0.8em",
    color: "#888",
    marginTop: "8px",
  };
  

  return (
    <div style={cardStyle}>
      {imageUrl && <img src={imageUrl} alt={post.title} style={imageStyle} />}

      <div style={contentStyle}>
        <h3 style={titleStyle}>
          <Link to={`/posts/${post._id}`}>{post.title}</Link>
        </h3>

        <p style={textStyle}>
          {post.content?.length > 100
            ? post.content.slice(0, 100) + "..."
            : post.content}
        </p>

        <small style={authorStyle}>By {post.author?.username || "Unknown"}</small>
      </div>
    </div>
  );
}