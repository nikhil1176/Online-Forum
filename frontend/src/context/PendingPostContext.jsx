// src/context/PendingPostContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import axiosClient from "../api/axiosClient";
import { AuthContext } from "./AuthContext";
import { getUnapprovedComments } from "../api/commentApi"; // Import comment API

export const PendingPostContext = createContext();

export const PendingPostProvider = ({ children }) => {
  const { isAdmin, user } = useContext(AuthContext);
  const [pendingCount, setPendingCount] = useState(0);

  const fetchPendingCount = async () => {
    // If user is not admin, reset count to 0 and stop
    if (!isAdmin || !user) {
      setPendingCount(0);
      return;
    }

    try {
      // Run both checks in parallel for speed
      const [postRes, commentRes] = await Promise.all([
        // 1. Get Pending Posts Count (returns object { count: X })
        axiosClient.get("/posts/admin/unapproved-count"),
        
        // 2. Get Pending Comments List (returns array [ ... ])
        // We use the length of the array to get the count
        getUnapprovedComments()
      ]);

      const postCount = postRes.data.count || 0;
      const commentCount = commentRes.data?.length || 0;

      // Set the total
      setPendingCount(postCount + commentCount);
      
    } catch (err) {
      console.error("Failed to fetch pending count:", err);
      // Optional: don't reset to 0 on error so previous count stays visible
    }
  };

  useEffect(() => {
    fetchPendingCount();
    
    // Optional: Refresh count every 15 seconds to keep it synced
    const interval = setInterval(fetchPendingCount, 15000);
    return () => clearInterval(interval);
  }, [isAdmin, user]);

  return (
    <PendingPostContext.Provider value={{ pendingCount, fetchPendingCount }}>
      {children}
    </PendingPostContext.Provider>
  );
};

export default PendingPostProvider;