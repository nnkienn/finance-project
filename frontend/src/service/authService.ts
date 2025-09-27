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
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>("/auth/login", { email, password });
    return res.data;
  },

  register: async (fullName: string, email: string, password: string) => {
    const res = await api.post("/auth/register", { fullName, email, password });
    return res.data;
  },

  refresh: async (): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>("/auth/refresh");
    return res.data;
  },

  logout: async () => {
    const res = await api.post("/auth/logout");
    return res.data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const res = await api.post("/auth/change-password", {
      currentPassword,
      newPassword,
    });
    return res.data;
  },

  me: async (): Promise<MeResponse> => {
    const res = await api.get<MeResponse>("/me");
    return res.data;
  },
};

// helper
function handleError(err: unknown, fallbackMsg: string): never {
  if (axios.isAxiosError(err)) {
    const axiosErr = err as AxiosError<ApiError>;
    const msg = axiosErr.response?.data?.message || fallbackMsg;
    throw new Error(msg);
  }
  throw new Error(fallbackMsg);
}
