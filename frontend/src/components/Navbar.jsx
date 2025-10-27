import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const nav = useNavigate();

  return (
    <nav style={{ padding: 12, borderBottom: "1px solid #eee" }}>
      <Link to="/">Forum</Link> {" | "}
      <Link to="/create">Create Post</Link>
      <span style={{ float: "right" }}>
        {user ? (
          <>
            <span style={{ marginRight: 8 }}>{user.username}</span>
            <button onClick={() => { logout(); nav("/"); }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link> {" / "}
            <Link to="/signup">Signup</Link>
          </>
        )}
      </span>
    </nav>
  );
}
