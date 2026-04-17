import axios from "axios";

// 🌐 Production: use VITE_API_URL env variable
// 🏠 Development: auto-detect local server host
const BASE_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : `http://${window.location.hostname}:5000/api`;

const API = axios.create({
  baseURL: BASE_URL,
});

// 🔐 Single interceptor — user token takes priority over supplier token
API.interceptors.request.use((req) => {
  const userToken = localStorage.getItem("token");
  const supplierToken = localStorage.getItem("supplierToken");

  const token = userToken || supplierToken;

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;
