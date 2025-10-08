// src/store/slice/transactionSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Transaction } from "@/type/transaction";
import {
  transactionService,
  TransactionPayload,
  PagedResponse,
  MonthlyCardsResponse,
  TimeseriesResponse,
} from "@/service/transactionService";
import { TransactionType } from "@/type/TransactionType";

// =====================
// Async thunks – CRUD
// =====================
export const fetchTransactions = createAsyncThunk<Transaction[]>(
  "transactions/fetchAll",
  async () => await transactionService.getUserTransactions()
);

export const createTransaction = createAsyncThunk<
  Transaction,
  TransactionPayload
>("transactions/create", async (data) =>
  transactionService.createTransaction(data)
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
// Async thunks – Charts/KPIs
// =====================

// 4 ô cards
export const fetchMonthlyCards = createAsyncThunk<
  MonthlyCardsResponse,
  { month: number; year: number }
>("transactions/fetchMonthlyCards", async ({ month, year }) =>
  transactionService.getMonthlyCards(month, year)
);

// Pie theo danh mục (All Expenses mặc định)
export const fetchCategoryBreakdown = createAsyncThunk<
  Record<string, number>,
  { month: number; year: number; type?: TransactionType }
>("transactions/fetchCategoryBreakdown", async ({ month, year, type = "EXPENSE" }) =>
  transactionService.getCategoryBreakdown(month, year, type) as Promise<Record<string, number>>
);

// Pie theo phương thức
export const fetchPaymentBreakdown = createAsyncThunk<
  Record<string, number>,
  { month: number; year: number; type?: TransactionType }
>("transactions/fetchPaymentBreakdown", async ({ month, year, type = "EXPENSE" }) =>
  transactionService.getPaymentBreakdown(month, year, type) as Promise<Record<string, number>>
);

// Money Flow (timeseries)
export const fetchTimeseries = createAsyncThunk<
  TimeseriesResponse["points"],
  { from: string; to: string; granularity?: "DAILY" | "WEEKLY" | "MONTHLY"; scope?: "ALL" | "INCOME" | "EXPENSE" }
>("transactions/fetchTimeseries", async (params) => {
  const res = await transactionService.getTimeseries(params);
  return res.points;
});

// =====================
// Slice
// =====================
interface TransactionState {
  items: Transaction[];
  loading: boolean;
  error: string | null;

  // paging
  totalPages: number;
  totalElements: number;
  page: number;
  size: number;

  // charts/KPIs
  cards: MonthlyCardsResponse | null;
  cardsLoading: boolean;

  chartsLoading: boolean;
  chartsError: string | null;

  categoryBreakdown: Record<string, number> | null;
  paymentBreakdown: Record<string, number> | null;
  timeseries: { date: string; income: number; expense: number; net: number }[];
}

const initialState: TransactionState = {
  items: [],
  loading: false,
  error: null,
  totalPages: 0,
  totalElements: 0,
  page: 0,
  size: 10,

  cards: null,
  cardsLoading: false,

  chartsLoading: false,
  chartsError: null,

  categoryBreakdown: null,
  paymentBreakdown: null,
  timeseries: [],
};

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ===== fetch all =====
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action: PayloadAction<Transaction[]>) => {
        state.loading = false;
        // tránh mutate payload
        state.items = [...action.payload].sort(
          (a, b) =>
            new Date(b.transactionDate).getTime() -
            new Date(a.transactionDate).getTime()
        );
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load transactions";
      })

      // ===== create =====
      .addCase(createTransaction.pending, (state) => {
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state, action: PayloadAction<Transaction>) => {
        state.items = [action.payload, ...state.items];
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.error = action.error.message || "Create failed";
      })

      // ===== update =====
      .addCase(updateTransaction.pending, (state) => {
        state.error = null;
      })
      .addCase(updateTransaction.fulfilled, (state, action: PayloadAction<Transaction>) => {
        const idx = state.items.findIndex((t) => t.id === action.payload.id);
        if (idx >= 0) state.items[idx] = action.payload;
        state.items = [...state.items].sort(
          (a, b) =>
            new Date(b.transactionDate).getTime() -
            new Date(a.transactionDate).getTime()
        );
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.error = action.error.message || "Update failed";
      })

      // ===== delete =====
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.error = action.error.message || "Delete failed";
      })
      .addCase(deleteTransaction.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
        // Optional: cập nhật totalElements nếu bạn hiển thị
        if (state.totalElements > 0) state.totalElements -= 1;
      })

      // ===== filter non-paged =====
      .addCase(filterTransactions.fulfilled, (state, action: PayloadAction<Transaction[]>) => {
        state.items = [...action.payload].sort(
          (a, b) =>
            new Date(b.transactionDate).getTime() -
            new Date(a.transactionDate).getTime()
        );
      })

      // ===== fetch paged / filter paged =====
      .addCase(fetchTransactionsPaged.fulfilled, (state, action: PayloadAction<PagedResponse<Transaction>>) => {
        state.items = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.totalElements = action.payload.totalElements;
        state.page = action.payload.number;
        state.size = action.payload.size;
      })
      .addCase(filterTransactionsPaged.fulfilled, (state, action: PayloadAction<PagedResponse<Transaction>>) => {
        state.items = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.totalElements = action.payload.totalElements;
        state.page = action.payload.number;
        state.size = action.payload.size;
      })

      // ===== cards =====
      .addCase(fetchMonthlyCards.pending, (state) => {
        state.cardsLoading = true;
      })
      .addCase(fetchMonthlyCards.fulfilled, (state, action: PayloadAction<MonthlyCardsResponse>) => {
        state.cardsLoading = false;
        state.cards = action.payload;
      })
      .addCase(fetchMonthlyCards.rejected, (state, action) => {
        state.cardsLoading = false;
        state.chartsError = action.error.message || "Load cards failed";
      })

      // ===== breakdowns =====
      .addCase(fetchCategoryBreakdown.pending, (state) => {
        state.chartsLoading = true;
        state.chartsError = null;
      })
      .addCase(fetchCategoryBreakdown.fulfilled, (state, action: PayloadAction<Record<string, number>>) => {
        state.chartsLoading = false;
        state.categoryBreakdown = action.payload;
      })
      .addCase(fetchCategoryBreakdown.rejected, (state, action) => {
        state.chartsLoading = false;
        state.chartsError = action.error.message || "Load category breakdown failed";
      })

      .addCase(fetchPaymentBreakdown.pending, (state) => {
        state.chartsLoading = true;
        state.chartsError = null;
      })
      .addCase(fetchPaymentBreakdown.fulfilled, (state, action: PayloadAction<Record<string, number>>) => {
        state.chartsLoading = false;
        state.paymentBreakdown = action.payload;
      })
      .addCase(fetchPaymentBreakdown.rejected, (state, action) => {
        state.chartsLoading = false;
        state.chartsError = action.error.message || "Load payment breakdown failed";
      })

      // ===== timeseries =====
      .addCase(fetchTimeseries.pending, (state) => {
        state.chartsLoading = true;
        state.chartsError = null;
      })
      .addCase(fetchTimeseries.fulfilled, (state, action: PayloadAction<TimeseriesResponse["points"]>) => {
        state.chartsLoading = false;
        state.timeseries = action.payload;
      })
      .addCase(fetchTimeseries.rejected, (state, action) => {
        state.chartsLoading = false;
        state.chartsError = action.error.message || "Load timeseries failed";
      });
  },
});

export default transactionSlice.reducer;
