// src/service/masterCategoryService.ts
import api from "@/lib/api";
import { MasterCategory } from "@/type/Mastercategory";

export const getMasterCategories = async (type?: "EXPENSE" | "INCOME" | "SAVING") => {
  const res = await api.get<MasterCategory[]>("/api/master-categories", {
    params: type ? { type } : {},
  });
  return res.data;
};

export const getMasterCategoryById = async (id: number) => {
  const res = await api.get<MasterCategory>(`/api/master-categories/${id}`);
  return res.data;
};

export const createMasterCategory = async (data: Omit<MasterCategory, "id">) => {
  const res = await api.post<MasterCategory>("/api/master-categories", data);
  return res.data;
};

export const updateMasterCategory = async (id: number, data: Omit<MasterCategory, "id">) => {
  const res = await api.put<MasterCategory>(`/api/master-categories/${id}`, data);
  return res.data;
};

export const deleteMasterCategory = async (id: number) => {
  await api.delete(`/api/master-categories/${id}`);
  return id;
};
