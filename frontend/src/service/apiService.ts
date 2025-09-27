// src/service/apiService.ts
import axios, { AxiosRequestConfig } from "axios";
import { AuthService } from "./authService";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080",
  withCredentials: true, // cookie refresh_token gửi kèm
});

// ---------------- Request Interceptor ----------------
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
      } catch {
        console.warn("❌ Failed to parse accessToken from localStorage");
      }
    }
  }
  return config;
});

// ---------------- Response Interceptor ----------------
let isRefreshing = false;
let waitQueue: Array<(token: string | null) => void> = [];

function flushQueue(newToken: string | null) {
  waitQueue.forEach((cb) => cb(newToken));
  waitQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const original = error?.config as CustomAxiosRequestConfig;

    if (!original) return Promise.reject(error);
    const isRefreshCall = (original.url || "").includes("/auth/refresh");

    if (status === 401 && !original._retry && !isRefreshCall) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          waitQueue.push((token) => {
            if (!token) return reject(error);
            original.headers = original.headers || {};
            (original.headers as any).Authorization = `Bearer ${token}`;
            resolve(api(original));
          });
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const res = await AuthService.refresh(); // { accessToken }
        const newAccessToken = res?.accessToken;

        if (newAccessToken) {
          if (typeof window !== "undefined") {
            const raw = localStorage.getItem("auth");
            const obj = raw ? JSON.parse(raw) : {};
            obj.accessToken = newAccessToken;
            localStorage.setItem("auth", JSON.stringify(obj));

            document.cookie = `accessToken=${newAccessToken}; path=/;`;
          }

          api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          flushQueue(newAccessToken);

          original.headers = original.headers || {};
          (original.headers as any).Authorization = `Bearer ${newAccessToken}`;
          return api(original);
        }

        flushQueue(null);
        return Promise.reject(error);
      } catch (e) {
        flushQueue(null);
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth");
          document.cookie = "accessToken=; Max-Age=0; path=/;";
        }
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
