import axios from "axios";

export const api = axios.create({
  baseURL: "https://test-fe.mysellerpintar.com/api",
  withCredentials: false,
});

// attach token (client only)
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token"); // simpan token login di Step 2
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
