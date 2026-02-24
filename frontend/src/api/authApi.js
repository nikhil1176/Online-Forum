// src/api/authApi.js
import axiosClient from "./axiosClient";

export const register = (data) => {
  return axiosClient.post("/auth/register", data);
};

export const loginApi = (email, password) => {
  return axiosClient.post("/auth/login", { email, password });
};

export const logoutApi = () => {
  return axiosClient.post("/auth/logout");
};

export const me = () => {
  return axiosClient.get("/auth/me");
};
