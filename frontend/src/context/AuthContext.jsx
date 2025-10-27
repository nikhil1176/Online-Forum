import React, { createContext, useState, useEffect } from "react";
// Import 'me' --- this was the missing piece
import { me } from "../api/authApi";
// We don't need 'login' or 'register' from authApi here

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // Initialize token state from localStorage
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  // Start with loading=true until we check the token
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          // Verify the token using the 'me' endpoint
          // We don't pass the token here, the axios interceptor does it
          const res = await me(); 
          
          // Set user and token state from the verified response
          setUser(res.data.user || null);
          setToken(storedToken);
        } catch (err) {
          // If 'me' call fails, the token is bad or expired
          console.error("Auth check failed", err);
          setToken(null);
          setUser(null);
          localStorage.removeItem("token");
        }
      }
      // Finished checking, set loading to false
      setLoading(false);
    };
    init();
  }, []); // <-- Run this ONLY once on app load

  const login = (t, userData) => {
    // This function is called from LoginPage
    setToken(t);
    localStorage.setItem("token", t);
    setUser(userData);
  };

  const logout = () => {
    // This function is called from Navbar
    setToken(null);
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {/* Only render children when NOT loading */}
      {!loading && children}
    </AuthContext.Provider>
  );
};