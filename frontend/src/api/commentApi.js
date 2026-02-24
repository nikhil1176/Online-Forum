// src/api/commentApi.js
import axiosClient from "./axiosClient";

const BASE = "/comments";

// --- GET REQUESTS ---
export const getCommentsByPost = (postId) => {
  return axiosClient.get(`${BASE}/${postId}`);
};

export const getReplies = (commentId) => {
  return axiosClient.get(`${BASE}/replies/${commentId}`);
};

export const getUnapprovedComments = () => {
  return axiosClient.get(`${BASE}/admin/unapproved`);
};

export const getMyComments = () => {
  return axiosClient.get(`${BASE}/my-comments`);
};

// --- POST REQUESTS ---
export const addComment = (postId, data) => {
  return axiosClient.post(`${BASE}/${postId}`, data);
};

export const addReply = (commentId, data) => {
  return axiosClient.post(`${BASE}/reply/${commentId}`, data);
};

export const upvoteComment = (commentId) => {
  return axiosClient.post(`${BASE}/${commentId}/upvote`);
};

export const downvoteComment = (commentId) => {
  return axiosClient.post(`${BASE}/${commentId}/downvote`);
};

// --- PUT/DELETE REQUESTS (Admin & User Actions) ---
export const approveComment = (commentId) => {
  return axiosClient.put(`${BASE}/admin/${commentId}/approve`);
};

export const rejectComment = (commentId, remarks) => {
  return axiosClient.put(`${BASE}/admin/${commentId}/reject`, { remarks });
};

export const deleteComment = (id) => {
  return axiosClient.delete(`${BASE}/${id}`);
};

export const editComment = (id, text) => {
  return axiosClient.put(`${BASE}/${id}`, { text });
};