// File: src/api/axiosConfig.js
import axios from "axios";

// --- 1. SET YOUR BACKEND PORT HERE ---
// (e.g., 5000, 3001, 8000, etc. Whatever your server.js is running on)
const BACKEND_PORT = 5000;
// ------------------------------------

const api = axios.create({
  baseURL: `http://localhost:${BACKEND_PORT}/api`
});

// --- 2. ADD THE TOKEN INTERCEPTOR ---
// This automatically adds the token to EVERY request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;