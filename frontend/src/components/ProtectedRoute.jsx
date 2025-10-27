import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { token, loading } = useContext(AuthContext);
  if (loading) 
  return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  return token ? children : <Navigate to="/login" replace />;
}
