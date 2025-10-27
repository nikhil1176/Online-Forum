import React, { useState } from "react";
import { register as apiRegister } from "../api/authApi";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiRegister({ username, email, password });
      alert(res.data.msg || "Signup successful");
      nav("/login");
    } catch (err) {
      console.error("Signup Error:", err);
      alert(err.response?.data?.msg || "Signup failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm"
      >
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">Sign Up</h2>
        <input
          placeholder="Username"
          className="w-full mb-3 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition"
        >
          Register
        </button>
      </form>
    </div>
  );
}