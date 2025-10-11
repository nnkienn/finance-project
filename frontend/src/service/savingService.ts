// src/service/savingService.ts
import api from "./apiService";

export type SavingGoalRequest = {
  name: string;
  targetAmount: number;
  startDate?: string | null; // "YYYY-MM-DD" or null
  endDate?: string | null;
  description?: string | null;
};

export type SavingGoalUpdateRequest = {
  name?: string;
  targetAmount?: number;
  startDate?: string | null;
  endDate?: string | null;
  description?: string | null;
};

export type SavingGoalResponse = {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  startDate?: string | null;
  endDate?: string | null;
  description?: string | null;
  status?: string; // e.g. IN_PROGRESS / ACHIEVED
  createdAt?: string;
  updatedAt?: string;
};

const BASE = "/api/saving-goals";

export const savingService = {
  async list(): Promise<SavingGoalResponse[]> {
    const { data } = await api.get(BASE);
    return data;
  },

  async detail(id: number): Promise<SavingGoalResponse> {
    const { data } = await api.get(`${BASE}/${id}`);
    return data;
  },

  async create(payload: SavingGoalRequest): Promise<SavingGoalResponse> {
    const { data } = await api.post(BASE, payload);
    return data;
  },

  async update(id: number, payload: SavingGoalUpdateRequest): Promise<SavingGoalResponse> {
    const { data } = await api.put(`${BASE}/${id}`, payload);
    return data;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`${BASE}/${id}`);
  },

  async history(id: number) {
    const { data } = await api.get(`${BASE}/${id}/history`);
    return data;
  },
};
