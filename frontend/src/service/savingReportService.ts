import api from "./apiService";

export type SavingMonthlyReport = {
  month: string;
  total: number; // ✅ đúng key JSON
};

export type SavingGoalSummary = {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  progress: number;
};

const BASE = "/api/saving-report";

export const savingReportService = {
  async getMonthly(): Promise<SavingMonthlyReport[]> {
    const { data } = await api.get(`${BASE}/monthly`);
    return data;
  },

  async getTopGoals(): Promise<SavingGoalSummary[]> {
    const { data } = await api.get(`${BASE}/top-goals`);
    return data;
  },

  async getFailedGoals(): Promise<SavingGoalSummary[]> {
    const { data } = await api.get(`${BASE}/failure`);
    return data;
  },
};
