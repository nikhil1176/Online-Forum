// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import axiosClient from "../api/axiosClient";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosClient.post("/auth/login", { email, password });
      const { accessToken, user } = res.data;

      login(accessToken, user);

      alert("Login successful!");
      nav("/");
    } catch (err) {
      console.error("Login Error:", err);
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 border border-gray-300 rounded-md p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 border border-gray-300 rounded-md p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md">
          Login
        </button>
      </form>
    </div>
  );
}
