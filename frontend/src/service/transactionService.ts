// src/service/transactionService.ts
import api from "./apiService";
import { TransactionType } from "@/type/TransactionType";
import { Transaction } from "@/type/transaction";

const API_URL = "/api/transactions";

// ---------- Types ----------
export interface TransactionPayload {
  amount: number;
  type: TransactionType;              // "EXPENSE" | "INCOME" | "SAVING"
  paymentMethod: string;              // hoặc enum riêng nếu bạn có
  note: string;
  transactionDate: string;            // ISO: "2025-10-08T09:00:00"
  userCategoryId: number;
}

export interface PagedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

// Dashboard cards
export interface MonthlyCardsResponse {
  myBalance: number;
  income: number;
  savings: number;
  expenses: number;
  incomePct: number;
  savingsPct: number;
  expensesPct: number;
}

// Simple summary map: { INCOME, EXPENSE, NET }
export type SummaryMap = Record<string, number>;

// Pie breakdown (BE trả về map)
export type BreakdownMap = Record<string, number>;

// Timeseries
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
  // CRUD
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

  // Latest
  async getLatestTransactions(limit = 5): Promise<Transaction[]> {
    const { data } = await api.get(`${API_URL}/latest`, { params: { limit } });
    return data;
  },

  // Filter (non-paged)
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

  // Filter + Pagination
  async getTransactionsPaged(params: {
    startDate?: string;
    endDate?: string;
    type?: TransactionType;
    categoryId?: number;
    paymentMethod?: string;
    page?: number;
    size?: number;
    sort?: string; // "transactionDate,desc"
  }): Promise<PagedResponse<Transaction>> {
    const { data } = await api.get(`${API_URL}/filter-paged`, { params });
    return data;
  },

  // ===== Dashboard cards (4 ô) =====
  async getMonthlyCards(month: number, year: number): Promise<MonthlyCardsResponse> {
    const { data } = await api.get(`${API_URL}/cards`, { params: { month, year } });
    return data;
  },

  // (Optional) summary {INCOME, EXPENSE, NET}
  async getMonthlySummary(month: number, year: number): Promise<SummaryMap> {
    const { data } = await api.get(`${API_URL}/summary`, { params: { month, year } });
    return data;
  },

  // Pie: category breakdown (All Expenses → type=EXPENSE)
  async getCategoryBreakdown(
    month: number,
    year: number,
    type: TransactionType = "EXPENSE"
  ): Promise<BreakdownMap> {
    const { data } = await api.get(`${API_URL}/category-breakdown`, { params: { month, year, type } });
    return data;
  },

  // Pie: payment method breakdown
  async getPaymentBreakdown(
    month: number,
    year: number,
    type: TransactionType = "EXPENSE"
  ): Promise<BreakdownMap> {
    const { data } = await api.get(`${API_URL}/payment-breakdown`, { params: { month, year, type } });
    return data;
  },

  // Timeseries for Money Flow
  async getTimeseries(params: {
    from: string; // "YYYY-MM-DD"
    to: string;   // "YYYY-MM-DD"
    granularity?: "DAILY" | "WEEKLY" | "MONTHLY";
    scope?: "ALL" | "INCOME" | "EXPENSE";
  }): Promise<TimeseriesResponse> {
    const { data } = await api.get(`${API_URL}/timeseries`, {
      params: { granularity: "DAILY", scope: "ALL", ...params },
    });
    return data;
  },
};
