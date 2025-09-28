// src/service/userCategoryService.ts
import api from "./apiService";
import { UserCategory } from "@/type/UserCategory";

// Lấy tất cả category của user
export const getUserCategories = async (): Promise<UserCategory[]> => {
  const res = await api.get<UserCategory[]>("/api/user-categories");
  return res.data;
};

// Lấy category theo masterId
export const getUserCategoriesByMaster = async (
  masterId: number
): Promise<UserCategory[]> => {
  const res = await api.get<UserCategory[]>(
    `/api/user-categories/by-master/${masterId}`
  );
  return res.data;
};

// Tạo mới
export const createUserCategory = async (data: {
  name: string;
  icon?: string;
  masterCategoryId: number;
}): Promise<UserCategory> => {
  const res = await api.post<UserCategory>("/api/user-categories", data);
  return res.data;
};

// Cập nhật
export const updateUserCategory = async (
  id: number,
  data: { name: string; icon?: string; masterCategoryId: number }
): Promise<UserCategory> => {
  const res = await api.put<UserCategory>(`/api/user-categories/${id}`, data);
  return res.data;
};

// Xoá
export const deleteUserCategory = async (id: number): Promise<number> => {
  await api.delete(`/api/user-categories/${id}`);
  return id;
};

// Lọc theo type
export const filterUserCategories = async (
  type: "EXPENSE" | "INCOME" | "SAVING"
): Promise<UserCategory[]> => {
  const res = await api.get<UserCategory[]>("/api/user-categories/filter", {
    params: { type },
  });
  return res.data;
};

// Search theo tên
export const searchUserCategories = async (
  keyword: string
): Promise<UserCategory[]> => {
  const res = await api.get<UserCategory[]>("/api/user-categories/search", {
    params: { keyword },
  });
  return res.data;
};

// Import từ master mặc định
export const importDefaultCategories = async (): Promise<UserCategory[]> => {
  await api.post("/api/user-categories/import-default");
  const res = await api.get<UserCategory[]>("/api/user-categories");
  return res.data;
};
