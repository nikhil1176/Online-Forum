import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios"; // Uses default axios for the initial fetch

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 1. Initialize Token from Local Storage
  const [token, setToken] = useState(() => {
    const saved = localStorage.getItem("token");
    return (saved && saved !== "null" && saved !== "undefined") ? saved : null;
  });

  // 2. Initialize User from Local Storage (Persists Admin Role on Refresh)
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // Helper to check if user is admin
  const isAdmin = user?.role === "admin";

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // Clean up user data
    setToken(null);
    setUser(null);
  };

  const login = (newToken, userData) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData)); // Save user data
    setToken(newToken);
    setUser(userData);
  };

  useEffect(() => {
    const initAuth = async () => {
      // If no token, stop loading
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Verify token with backend
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // FIX: Extract the inner 'user' object so 'user.role' works correctly
        const userData = res.data.user; 
        
        // Update state and sync to local storage
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        
      } catch (err) {
        console.error("Auth Init Error:", err);
        // If the token is invalid/expired, log out
        logout(); 
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [token]);

  const value = { 
    user, 
    setUser, 
    token, 
    setToken, 
    loading, 
    isAdmin, 
    login, 
    logout 
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;