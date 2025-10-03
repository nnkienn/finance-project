// src/service/transactionService.ts
import api from "./apiService";
import { TransactionType } from "@/type/TransactionType";
import { Transaction } from "@/type/transaction";

const API_URL = "/api/transactions";

// =====================
// Types
// =====================
export interface TransactionPayload {
  amount: number;
  type: TransactionType; // "EXPENSE" | "INCOME" | "SAVING"
  paymentMethod: string; // "CASH" | "BANK" | "CARD"
  note: string;
  transactionDate: string; // ISO format
  userCategoryId: number;
}

// Response của Spring Data Page
export interface PagedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; // page hiện tại
  size: number;   // số record/trang
}

// =====================
// Service
// =====================
export const transactionService = {
  // Create
  async createTransaction(payload: TransactionPayload): Promise<Transaction> {
    const res = await api.post(API_URL, payload);
    return res.data;
  },

  // Get all
  async getUserTransactions(): Promise<Transaction[]> {
    const res = await api.get(API_URL);
    return res.data;
  },

  // Get by id
  async getTransactionById(id: number): Promise<Transaction> {
    const res = await api.get(`${API_URL}/${id}`);
    return res.data;
  },

  // Update
  async updateTransaction(
    id: number,
    payload: Partial<TransactionPayload>
  ): Promise<Transaction> {
    const res = await api.put(`${API_URL}/${id}`, payload);
    return res.data;
  },

  // Delete
  async deleteTransaction(id: number): Promise<void> {
    await api.delete(`${API_URL}/${id}`);
  },

  // Get latest
  async getLatestTransactions(limit: number = 5): Promise<Transaction[]> {
    const res = await api.get(`${API_URL}/latest`, { params: { limit } });
    return res.data;
  },

  // Filter (non-paged)
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

  // Filter + Pagination
  async getTransactionsPaged(params: {
    startDate?: string;
    endDate?: string;
    type?: TransactionType;
    categoryId?: number;
    paymentMethod?: string;
    page?: number;
    size?: number;
    sort?: string; // ví dụ: "transactionDate,desc"
  }): Promise<PagedResponse<Transaction>> {
    const res = await api.get(`${API_URL}/filter-paged`, { params });
    return res.data;
  },
};
