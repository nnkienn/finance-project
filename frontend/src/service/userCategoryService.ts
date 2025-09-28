// src/service/userCategoryService.ts
import api from "./apiService";
import { UserCategory } from "@/type/UserCategory";

export const getUserCategories = async () => {
  const res = await api.get<UserCategory[]>("/api/user-categories");
  return res.data;
};

export const createUserCategory = async (data: {
  name: string;
  icon?: string;
  masterCategoryId: number;
}) => {
  const res = await api.post<UserCategory>("/api/user-categories", data);
  return res.data;
};

export const updateUserCategory = async (
  id: number,
  data: { name: string; icon?: string; masterCategoryId: number }
) => {
  const res = await api.put<UserCategory>(`/api/user-categories/${id}`, data);
  return res.data;
};

export const deleteUserCategory = async (id: number) => {
  await api.delete(`/api/user-categories/${id}`);
  return id;
};

export const filterUserCategories = async (
  type: "EXPENSE" | "INCOME" | "SAVING"
) => {
  const res = await api.get<UserCategory[]>("/api/user-categories/filter", {
    params: { type },
  });
  return res.data;
};

export const searchUserCategories = async (keyword: string) => {
  const res = await api.get<UserCategory[]>("/api/user-categories/search", {
    params: { keyword },
  });
  return res.data;
};

export const importDefaultCategories = async () => {
  await api.post("/api/user-categories/import-default");
};
