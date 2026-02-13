import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api", // Backend runs on port 5000
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
