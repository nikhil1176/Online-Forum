// src/api/axiosClient.js
import axios from "axios";

const axiosClient = axios.create({
  // Uses your env variable if it exists, otherwise defaults to localhost:5000
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  withCredentials: true,
});

axiosClient.interceptors.request.use(
  (config) => {
    // 1. Try to find the token using BOTH common names
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken");

    if (token) {
      // 2. Remove any extra quotes if they exist (common localStorage bug)
      const cleanToken = token.replace(/^"|"$/g, '');
      
      // 3. Attach the token to the header
      config.headers.Authorization = `Bearer ${cleanToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;