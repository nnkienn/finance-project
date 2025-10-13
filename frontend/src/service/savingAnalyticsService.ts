import api from "./apiService";

export type SavingSummary = {
  totalSaved: number;
  totalGoals: number;
  achieved: number;
  active: number;
};

export type SavingGoalProgress = {
  id: number;
  name: string;
  currentAmount: number;
  targetAmount: number;
  progress: number; // %
};

export type SavingTrendPoint = {
  period: string; // e.g. "2025-05"
  total: number;
};

const BASE = "/api/saving-goals";

export const savingAnalyticsService = {
  async getSummary(): Promise<SavingSummary> {
    const { data } = await api.get(`${BASE}/summary`);
    // ✅ Map backend key -> frontend key
    return {
      totalSaved: data.totalSaved ?? 0,
      totalGoals: data.totalGoals ?? 0,
      achieved: data.achievedGoals ?? 0,
      active: data.activeGoals ?? 0,
    };
  },

  async getProgress(): Promise<SavingGoalProgress[]> {
    const { data } = await api.get(`${BASE}/progress`);
    return data;
  },

  async getTrend(granularity: "MONTHLY" | "WEEKLY" = "MONTHLY"): Promise<SavingTrendPoint[]> {
    const { data } = await api.get(`${BASE}/trend?granularity=${granularity}`);
    return data;
  },
};
