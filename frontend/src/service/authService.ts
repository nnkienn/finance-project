// src/service/authService.ts
import api from "./apiService";
import axios, { AxiosError } from "axios";

interface ApiError {
  message: string;
}

export interface AuthResponse {
  tokenType: string;   // "Bearer"
  accessToken: string; // JWT
  expiresIn: number;   // seconds
}

export interface MeResponse {
  id: number;
  email: string;
  fullName: string;
  avatarUrl?: string;
  facebookId?: string;
  googleId?: string;
  createdAt: string;
  enabled: boolean;
  emailVerifiedAt?: string;
  roles: string[];
}

export const AuthService = {
  // 🔐 Login
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>("/auth/login", { email, password });
    return res.data;
  },

  // 📝 Register
  register: async (fullName: string, email: string, password: string) => {
    const res = await api.post("/auth/register", { fullName, email, password });
    return res.data;
  },

  // 🔄 Refresh token
  refresh: async (): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>("/auth/refresh");
    return res.data;
  },

  // 🚪 Logout
  logout: async () => {
    const res = await api.post("/auth/logout");
    return res.data;
  },

  // 🔑 Change password
  changePassword: async (currentPassword: string, newPassword: string) => {
    const res = await api.post("/auth/change-password", {
      currentPassword,
      newPassword,
    });
    return res.data;
  },

  // 👤 Get user info
  me: async (): Promise<MeResponse> => {
    const res = await api.get<MeResponse>("/me");
    return res.data;
  },

  // 🧩 Update user info (optional fields)
  updateMe: async (data: { fullName?: string; email?: string; avatarUrl?: string }) => {
    const res = await api.patch("/me", data);
    return res.data;
  },

  // 🖼️ Upload avatar (trả về MeResponse)
  uploadAvatar: async (file: File): Promise<MeResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post<MeResponse>("/upload/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  },

};




// ⚠️ Helper — dùng để bắt lỗi Axios gọn gàng
function handleError(err: unknown, fallbackMsg: string): never {
  if (axios.isAxiosError(err)) {
    const axiosErr = err as AxiosError<ApiError>;
    const msg = axiosErr.response?.data?.message || fallbackMsg;
    throw new Error(msg);
  }
  throw new Error(fallbackMsg);
}
