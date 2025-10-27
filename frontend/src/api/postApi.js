// File: src/api/postApi.js
import api from "./axiosConfig"; // This line should already be correct

export const getAllPosts = () => api.get("/posts");
export const getPost = (id) => api.get(`/posts/${id}`);

// No 'token' argument needed anymore!
export const createPost = (data) => api.post("/posts", data);
export const deletePost = (id) => api.delete(`/posts/${id}`);
export const updatePost = (id, data) => api.put(`/posts/${id}`, data);