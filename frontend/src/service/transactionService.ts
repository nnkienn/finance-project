import api from "./apiService";
import { TransactionType } from "@/type/TransactionType";
import { Transaction } from "@/type/transaction";

const API_URL = "/api/transactions";
const ANALYTICS_URL = `${API_URL}/analytics`; // ✅ tách prefix riêng

// ---------- Types ----------
export interface TransactionPayload {
  amount: number;
  type: TransactionType;              // "EXPENSE" | "INCOME" | "SAVING"
  paymentMethod?: string;
  note: string;
  transactionDate: string;
  userCategoryId?: number | null;
  savingGoalId?: number | null;
}

export interface PagedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

export interface MonthlyCardsResponse {
  myBalance: number;
  income: number;
  savings: number;
  expenses: number;
  incomePct: number;
  savingsPct: number;
  expensesPct: number;
}

export type SummaryMap = Record<string, number>;
export type BreakdownMap = Record<string, number>;

export interface TimeseriesPoint {
  date: string;
  income: number;
  expense: number;
  net: number;
}
export interface TimeseriesResponse {
  points: TimeseriesPoint[];
}

// ---------- Service ----------
export const transactionService = {
  // ==================== CRUD ====================
  async createTransaction(payload: TransactionPayload): Promise<Transaction> {
    const { data } = await api.post(API_URL, payload);
    return data;
  },

  async getUserTransactions(): Promise<Transaction[]> {
    const { data } = await api.get(API_URL);
    return data;
  },

  async getTransactionById(id: number): Promise<Transaction> {
    const { data } = await api.get(`${API_URL}/${id}`);
    return data;
  },

  async updateTransaction(id: number, payload: Partial<TransactionPayload>): Promise<Transaction> {
    const { data } = await api.put(`${API_URL}/${id}`, payload);
    return data;
  },

  async deleteTransaction(id: number): Promise<void> {
    await api.delete(`${API_URL}/${id}`);
  },

  async getLatestTransactions(limit = 5): Promise<Transaction[]> {
    const { data } = await api.get(`${API_URL}/latest`, { params: { limit } });
    return data;
  },

  // ==================== FILTER ====================
  async getTransactionsFiltered(params: {
    startDate?: string;
    endDate?: string;
    type?: TransactionType;
    categoryId?: number;
    paymentMethod?: string;
  }): Promise<Transaction[]> {
    const { data } = await api.get(`${API_URL}/filter`, { params });
    return data;
  },

  async getTransactionsPaged(params: {
    startDate?: string;
    endDate?: string;
    type?: TransactionType;
    categoryId?: number;
    paymentMethod?: string;
    page?: number;
    size?: number;
    sort?: string;
  }): Promise<PagedResponse<Transaction>> {
    const { data } = await api.get(`${API_URL}/filter-paged`, { params });
    return data;
  },

  // ==================== ANALYTICS ====================

  // 4 ô cards
  async getMonthlyCards(month: number, year: number): Promise<MonthlyCardsResponse> {
    const { data } = await api.get(`${ANALYTICS_URL}/cards`, { params: { month, year } });
    return data;
  },

  // Summary: INCOME / EXPENSE / NET
  async getMonthlySummary(month: number, year: number): Promise<SummaryMap> {
    const { data } = await api.get(`${ANALYTICS_URL}/summary`, { params: { month, year } });
    return data;
  },

  // Pie: Category breakdown
  async getCategoryBreakdown(
    month: number,
    year: number,
    type: TransactionType = "EXPENSE"
  ): Promise<BreakdownMap> {
    const { data } = await api.get(`${ANALYTICS_URL}/category-breakdown`, { params: { month, year, type } });
    return data;
  },

  // Pie: Payment method breakdown
  async getPaymentBreakdown(
    month: number,
    year: number,
    type: TransactionType = "EXPENSE"
  ): Promise<BreakdownMap> {
    const { data } = await api.get(`${ANALYTICS_URL}/payment-breakdown`, { params: { month, year, type } });
    return data;
  },

  // ==================== Tổng cộng ====================

  async getTotalSaving(): Promise<number> {
    const { data } = await api.get(`${ANALYTICS_URL}/total-saving`);
    return data;
  },

  async getTotalIncome(): Promise<number> {
    const { data } = await api.get(`${ANALYTICS_URL}/total-income`);
    return data;
  },

  async getTotalExpense(): Promise<number> {
    const { data } = await api.get(`${ANALYTICS_URL}/total-expense`);
    return data;
  },

async getAllTotals(): Promise<{
  totalIncome: number;
  totalExpense: number;
  totalSaving: number;
}> {
  const { data } = await api.get(`${ANALYTICS_URL}/total-all`);
  return data;
},


  // ==================== Timeseries ====================
  async getTimeseries(params: {
    from: string;
    to: string;
    granularity?: "DAILY" | "WEEKLY" | "MONTHLY";
    scope?: "ALL" | "INCOME" | "EXPENSE";
  }): Promise<TimeseriesResponse> {
    const { data } = await api.get(`${API_URL}/timeseries`, {
      params: { granularity: "DAILY", scope: "ALL", ...params },
    });
    return data;
  },
};
