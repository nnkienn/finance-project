import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Transaction } from "@/type/transaction";
import { transactionService, TransactionPayload } from "@/service/transactionService";

// =====================
// Async thunks
// =====================
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchAll",
  async () => await transactionService.getUserTransactions()
);

export const createTransaction = createAsyncThunk(
  "transactions/create",
  async (data: TransactionPayload) => await transactionService.createTransaction(data)
);

export const updateTransaction = createAsyncThunk(
  "transactions/update",
  async ({ id, data }: { id: number; data: Partial<TransactionPayload> }) =>
    await transactionService.updateTransaction(id, data)
);

export const deleteTransaction = createAsyncThunk(
  "transactions/delete",
  async (id: number) => {
    await transactionService.deleteTransaction(id);
    return id;
  }
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
      );
  },
});

export default transactionSlice.reducer;
