// src/lib/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080",
  withCredentials: true,
});

// ---------------- Request interceptor ----------------
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("auth");
    if (raw) {
      try {
        const { accessToken } = JSON.parse(raw);
        if (accessToken) {
          config.headers = config.headers || {};
          (config.headers as any).Authorization = `Bearer ${accessToken}`;
        }
      } catch {}
    }
  }
  return config;
});

export default api;
