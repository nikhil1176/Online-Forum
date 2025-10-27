// File: src/api/authApi.js
import api from "./axiosConfig"; // Import the single, configured instance

export const login = (formData) => api.post("/auth/login", formData);
export const register = (formData) => api.post("/auth/register", formData);

// The interceptor now handles the token, so you don't need to pass it
export const me = () => api.get("/auth/me");