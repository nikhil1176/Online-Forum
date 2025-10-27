import api from "./axiosConfig";

export const addComment = (postId, payload, token) =>
  api.post(`/comments`, { postId, ...payload }, { headers: { Authorization: `Bearer ${token}` }});
export const getCommentsByPost = (postId) =>
  api.get(`/comments?postId=${postId}`);
