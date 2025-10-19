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


// Tổng chi tiêu theo danh mục (cho biểu đồ donut)
export const getExpensesByCategory = async (
  month?: number,
  year?: number
): Promise<{ name: string; amount: number }[]> => {
  const res = await api.get<{ name: string; amount: number }[]>(
    "/api/user-categories/expenses-by-category",
    { params: { month, year } }
  );
  return res.data;
};

// Top danh mục chi tiêu cao nhất
export const getTopExpenseCategories = async (
  month?: number,
  year?: number,
  limit: number = 3
): Promise<{ name: string; amount: number }[]> => {
  const res = await api.get<{ name: string; amount: number }[]>(
    "/api/user-categories/top-expense-categories",
    { params: { month, year, limit } }
  );
  return res.data;
};

// Đếm số lượng user category theo từng type
export const countUserCategoriesByType = async (): Promise<{
  [key: string]: number;
}> => {
  const res = await api.get<{ [key: string]: number }>(
    "/api/user-categories/count-by-type"
  );
  return res.data;
};
