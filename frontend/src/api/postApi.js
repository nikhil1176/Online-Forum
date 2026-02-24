import axiosClient from "./axiosClient";

// Public Routes
export const getAllPosts = () => axiosClient.get("/posts");
export const getPost = (id) => axiosClient.get(`/posts/${id}`);

// Authenticated Routes (token auto injected)
export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append("image", file);
  return axiosClient.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const createPost = (data) => axiosClient.post("/posts", data);
export const likePost = (id) => axiosClient.post(`/posts/${id}/like`);

// ===> ADD THIS LINE BELOW <===
// Make sure this path '/downvote' matches exactly what you wrote in your backend!
export const downvotePost = (id) => axiosClient.post(`/posts/${id}/downvote`); 

export const deletePost = (id) => axiosClient.delete(`/posts/${id}`);
export const updatePost = (id, data) => axiosClient.put(`/posts/${id}`, data);

// My Posts
export const getMyPosts = () => axiosClient.get(`/posts/my-posts`);

// Admin
export const getUnapprovedPosts = () => axiosClient.get(`/posts/admin/unapproved`);
export const approvePost = (id) => axiosClient.put(`/posts/admin/${id}/approve`);
export const rejectPost = (id, remarks) =>
  axiosClient.put(`/posts/admin/${id}/reject`, { remarks });