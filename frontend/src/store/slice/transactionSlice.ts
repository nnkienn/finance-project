// src/store/slice/transactionSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Transaction } from "@/type/transaction";
import {
  transactionService,
  TransactionPayload,
} from "@/service/transactionService";

// =====================
// Async thunks
// =====================
export const fetchTransactions = createAsyncThunk<Transaction[]>(
  "transactions/fetchAll",
  async () => await transactionService.getUserTransactions()
);

export const createTransaction = createAsyncThunk<Transaction, TransactionPayload>(
  "transactions/create",
  async (data) => await transactionService.createTransaction(data)
);

export const updateTransaction = createAsyncThunk<
  Transaction,
  { id: number; data: Partial<TransactionPayload> }
>("transactions/update", async ({ id, data }) =>
  transactionService.updateTransaction(id, data)
);

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

// =====================
// Slice
// =====================
interface TransactionState {
  items: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  items: [],
  loading: false,
  error: null,
};

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTransactions.fulfilled,
        (state, action: PayloadAction<Transaction[]>) => {
          state.loading = false;
          state.items = action.payload;
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
          state.items.push(action.payload);
        }
      )

      // update
      .addCase(
        updateTransaction.fulfilled,
        (state, action: PayloadAction<Transaction>) => {
          const idx = state.items.findIndex((t) => t.id === action.payload.id);
          if (idx >= 0) state.items[idx] = action.payload;
        }
      )

      // delete
      .addCase(
        deleteTransaction.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.items = state.items.filter((t) => t.id !== action.payload);
        }
      )

      // filter
      .addCase(
        filterTransactions.fulfilled,
        (state, action: PayloadAction<Transaction[]>) => {
          state.items = action.payload;
        }
      );
  },
});

export default transactionSlice.reducer;
