// src/service/transactionService.ts
import api from "./apiService";
import { TransactionType } from "@/type/TransactionType";
import { Transaction } from "@/type/transaction";

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
  async createTransaction(payload: TransactionPayload): Promise<Transaction> {
    const res = await api.post(API_URL, payload);
    return res.data;
  },

  // Get all transactions của user
  async getUserTransactions(): Promise<Transaction[]> {
    const res = await api.get(API_URL);
    return res.data;
  },

  // Get 1 transaction by id
  async getTransactionById(id: number): Promise<Transaction> {
    const res = await api.get(`${API_URL}/${id}`);
    return res.data;
  },

  // Update transaction
  async updateTransaction(
    id: number,
    payload: Partial<TransactionPayload>
  ): Promise<Transaction> {
    const res = await api.put(`${API_URL}/${id}`, payload);
    return res.data;
  },

  // Delete transaction
  async deleteTransaction(id: number): Promise<void> {
    await api.delete(`${API_URL}/${id}`);
  },

  // Get latest transactions (limit)
  async getLatestTransactions(limit: number = 5): Promise<Transaction[]> {
    const res = await api.get(`${API_URL}/latest`, {
      params: { limit },
    });
    return res.data;
  },

  // Filter transactions (non-paged)
  async getTransactionsFiltered(params: {
    startDate?: string;
    endDate?: string;
    type?: TransactionType;
    categoryId?: number;
    paymentMethod?: string;
  }): Promise<Transaction[]> {
    const res = await api.get(`${API_URL}/filter`, { params });
    return res.data;
  },

  // Filter transactions with pagination
  async getTransactionsFilteredPaged(params: {
    startDate?: string;
    endDate?: string;
    type?: TransactionType;
    categoryId?: number;
    paymentMethod?: string;
    page?: number;
    size?: number;
  }): Promise<{ content: Transaction[]; totalElements: number }> {
    const res = await api.get(`${API_URL}/filter-paged`, { params });
    return res.data;
  },
};
