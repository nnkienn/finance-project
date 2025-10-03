// src/store/slice/transactionSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Transaction } from "@/type/transaction";
import {
  transactionService,
  TransactionPayload,
  PagedResponse,
} from "@/service/transactionService";

// =====================
// Async thunks
// =====================

// Lấy toàn bộ transaction (không phân trang)
export const fetchTransactions = createAsyncThunk<Transaction[]>(
  "transactions/fetchAll",
  async () => await transactionService.getUserTransactions()
);

// Create
export const createTransaction = createAsyncThunk<
  Transaction,
  TransactionPayload
>("transactions/create", async (data) =>
  transactionService.createTransaction(data)
);

// Update
export const updateTransaction = createAsyncThunk<
  Transaction,
  { id: number; data: Partial<TransactionPayload> }
>("transactions/update", async ({ id, data }) =>
  transactionService.updateTransaction(id, data)
);

// Delete
export const deleteTransaction = createAsyncThunk<number, number>(
  "transactions/delete",
  async (id) => {
    await transactionService.deleteTransaction(id);
    return id;
  }
);

// Filter (non-paged)
export const filterTransactions = createAsyncThunk<
  Transaction[],
  {
    startDate?: string;
    endDate?: string;
    type?: "EXPENSE" | "INCOME" | "SAVING";
    categoryId?: number;
    paymentMethod?: string;
  }
>("transactions/filter", async (filters) =>
  transactionService.getTransactionsFiltered(filters)
);

// Fetch paged
export const fetchTransactionsPaged = createAsyncThunk<
  PagedResponse<Transaction>,
  {
    startDate?: string;
    endDate?: string;
    type?: "EXPENSE" | "INCOME" | "SAVING";
    categoryId?: number;
    paymentMethod?: string;
    page?: number;
    size?: number;
    sort?: string;
  }
>("transactions/fetchPaged", async (params) =>
  transactionService.getTransactionsPaged(params)
);

// Filter + pagination
export const filterTransactionsPaged = createAsyncThunk<
  PagedResponse<Transaction>,
  {
    startDate?: string;
    endDate?: string;
    type?: "EXPENSE" | "INCOME" | "SAVING";
    categoryId?: number;
    paymentMethod?: string;
    page?: number;
    size?: number;
    sort?: string;
  }
>("transactions/filterPaged", async (params) =>
  transactionService.getTransactionsPaged(params)
);

// =====================
// Slice
// =====================
interface TransactionState {
  items: Transaction[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  totalElements: number;
  page: number;
  size: number;
}

const initialState: TransactionState = {
  items: [],
  loading: false,
  error: null,
  totalPages: 0,
  totalElements: 0,
  page: 0,
  size: 10,
};

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch all
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTransactions.fulfilled,
        (state, action: PayloadAction<Transaction[]>) => {
          state.loading = false;
          state.items = action.payload.sort(
            (a, b) =>
              new Date(b.transactionDate).getTime() -
              new Date(a.transactionDate).getTime()
          );
        }
      )
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load transactions";
      })

      // create
      .addCase(
        createTransaction.fulfilled,
        (state, action: PayloadAction<Transaction>) => {
          state.items = [action.payload, ...state.items];
        }
      )

      // update
      .addCase(
        updateTransaction.fulfilled,
        (state, action: PayloadAction<Transaction>) => {
          const idx = state.items.findIndex((t) => t.id === action.payload.id);
          if (idx >= 0) state.items[idx] = action.payload;
          state.items = [...state.items].sort(
            (a, b) =>
              new Date(b.transactionDate).getTime() -
              new Date(a.transactionDate).getTime()
          );
        }
      )

      // delete
      .addCase(
        deleteTransaction.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.items = state.items.filter((t) => t.id !== action.payload);
        }
      )

      // filter non-paged
      .addCase(
        filterTransactions.fulfilled,
        (state, action: PayloadAction<Transaction[]>) => {
          state.items = action.payload.sort(
            (a, b) =>
              new Date(b.transactionDate).getTime() -
              new Date(a.transactionDate).getTime()
          );
        }
      )

      // fetch paged
      .addCase(
        fetchTransactionsPaged.fulfilled,
        (state, action: PayloadAction<PagedResponse<Transaction>>) => {
          state.items = action.payload.content;
          state.totalPages = action.payload.totalPages;
          state.totalElements = action.payload.totalElements;
          state.page = action.payload.number;
          state.size = action.payload.size;
        }
      )

      // filter paged
      .addCase(
        filterTransactionsPaged.fulfilled,
        (state, action: PayloadAction<PagedResponse<Transaction>>) => {
          state.items = action.payload.content;
          state.totalPages = action.payload.totalPages;
          state.totalElements = action.payload.totalElements;
          state.page = action.payload.number;
          state.size = action.payload.size;
        }
      );
  },
});

export default transactionSlice.reducer;
