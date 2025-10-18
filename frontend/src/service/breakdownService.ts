// src/service/breakdownService.ts
import api from "./apiService";

export const breakdownService = {
  async getCategoryBreakdown(month: number, year: number) {
    const res = await api.get("/api/transactions/analytics/category-breakdown", {
      params: { month, year },
    });
    return res.data as Record<string, number>;
  },

  async getPaymentBreakdown(month: number, year: number) {
    const res = await api.get("/api/transactions/analytics/payment-breakdown", {
      params: { month, year },
    });
    return res.data as Record<string, number>;
  },
};
