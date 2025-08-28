import axios from "axios";

const instance = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // Laravel API URL
  withCredentials: true,
});

export default instance;
