import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // CHANGE if backend runs elsewhere
  headers: {
    "Content-Type": "application/json",
  },
});

// attach token automatically
api.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default api;
