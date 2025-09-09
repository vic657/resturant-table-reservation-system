// src/axiosClient.jsx
import axios from "axios";

const axiosClient = axios.create({
baseURL: import.meta.env.VITE_API_BASE_URL,
 
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
