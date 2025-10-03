// src/service/transactionService.ts
import api from "./apiService";
import { TransactionType } from "@/type/TransactionType";

const API_URL = "/api/transactions";

export interface TransactionPayload {
  amount: number;
  type: TransactionType; // "EXPENSE" | "INCOME" | "SAVING"
  paymentMethod: string; // "CASH" | "BANK" | "CARD"
  note: string;
  transactionDate: string; // ISO format
  userCategoryId: number;
}

export const transactionService = {
  // Create transaction
  async createTransaction(payload: TransactionPayload) {
    const res = await api.post(API_URL, payload);
    return res.data;
  },

  // Get all transactions của user
  async getUserTransactions() {
    const res = await api.get(API_URL);
    return res.data;
  },

  // Get 1 transaction by id
  async getTransactionById(id: number) {
    const res = await api.get(`${API_URL}/${id}`);
    return res.data;
  },

  // Update transaction
  async updateTransaction(id: number, payload: Partial<TransactionPayload>) {
    const res = await api.put(`${API_URL}/${id}`, payload);
    return res.data;
  },

  // Delete transaction
  async deleteTransaction(id: number) {
    const res = await api.delete(`${API_URL}/${id}`);
    return res.data;
  },

  // Get latest transactions (limit)
  async getLatestTransactions(limit: number = 5) {
    const res = await api.get(`${API_URL}/latest`, {
      params: { limit },
    });
    return res.data;
  },

  // Filtered + pagination
  async getTransactionsFiltered(params: {
    startDate?: string;
    endDate?: string;
    type?: TransactionType;
    categoryId?: number;
    paymentMethod?: string;
    page?: number;
    size?: number;
  }) {
    const res = await api.get(`${API_URL}/filter`, { params });
    return res.data;
  },
};
