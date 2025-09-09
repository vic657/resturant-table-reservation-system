// src/axiosClient.jsx
import axios from "axios";

const axiosClient = axios.create({
  https://resturant-table-reservation-system.onrender.com // ✅ pulled from Netlify env
});

// Attach token automatically
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
