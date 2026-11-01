import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 30000,
  headers: { Accept: "application/json" },
});
axiosClient.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
axiosClient.interceptors.response.use(response => response, error => {
  if (error.response?.status === 401 && !error.config?.url?.endsWith("/login")) {
    ["token", "user", "role"].forEach(key => localStorage.removeItem(key));
    window.location.assign("/login");
  }
  return Promise.reject(error);
});
export default axiosClient;