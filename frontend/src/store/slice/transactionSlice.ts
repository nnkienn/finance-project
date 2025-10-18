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

// =====================
// Async thunks – FILTER & PAGED
// =====================
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

// =====================
// Async thunks – Analytics
// =====================

// 4 ô cards
export const fetchMonthlyCards = createAsyncThunk<
  MonthlyCardsResponse,
  { month: number; year: number }
>("transactions/fetchMonthlyCards", async ({ month, year }) =>
  transactionService.getMonthlyCards(month, year)
);

// Pie theo danh mục
export const fetchCategoryBreakdown = createAsyncThunk<
  Record<string, number>,
  { month: number; year: number; type?: TransactionType }
>("transactions/fetchCategoryBreakdown", async ({ month, year, type = "EXPENSE" }) =>
  transactionService.getCategoryBreakdown(month, year, type)
);

// Pie theo phương thức thanh toán
export const fetchPaymentBreakdown = createAsyncThunk<
  Record<string, number>,
  { month: number; year: number; type?: TransactionType }
>("transactions/fetchPaymentBreakdown", async ({ month, year, type = "EXPENSE" }) =>
  transactionService.getPaymentBreakdown(month, year, type)
);

// Timeseries – Money Flow chart
export const fetchTimeseries = createAsyncThunk<
  TimeseriesResponse["points"],
  {
    from: string;
    to: string;
    granularity?: "DAILY" | "WEEKLY" | "MONTHLY";
    scope?: "ALL" | "INCOME" | "EXPENSE";
  }
>("transactions/fetchTimeseries", async (params) => {
  const res = await transactionService.getTimeseries(params);
  return res.points;
});

// Tổng riêng lẻ
export const fetchTotalSaving = createAsyncThunk<number>(
  "transactions/fetchTotalSaving",
  async () => await transactionService.getTotalSaving()
);
export const fetchTotalIncome = createAsyncThunk<number>(
  "transactions/fetchTotalIncome",
  async () => await transactionService.getTotalIncome()
);
export const fetchTotalExpense = createAsyncThunk<number>(
  "transactions/fetchTotalExpense",
  async () => await transactionService.getTotalExpense()
);

// ✅ Tổng hợp tất cả
export const fetchAllTotals = createAsyncThunk<
  { totalIncome: number; totalExpense: number; totalSaving: number }
>("transactions/fetchAllTotals", async () => await transactionService.getAllTotals());

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

  // cards & charts
  cards: MonthlyCardsResponse | null;
  cardsLoading: boolean;

  chartsLoading: boolean;
  chartsError: string | null;

  categoryBreakdown: Record<string, number> | null;
  paymentBreakdown: Record<string, number> | null;
  timeseries: { date: string; income: number; expense: number; net: number }[];

  // totals
  totalSaving: number;
  totalIncome: number;
  totalExpense: number;
  totalsLoading: boolean;
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

  totalSaving: 0,
  totalIncome: 0,
  totalExpense: 0,
  totalsLoading: false,
};

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ===== CRUD =====
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action: PayloadAction<Transaction[]>) => {
        state.loading = false;
        state.items = [...action.payload].sort(
          (a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
        );
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load transactions";
      })
      .addCase(createTransaction.fulfilled, (state, action: PayloadAction<Transaction>) => {
        state.items = [action.payload, ...state.items];
      })
      .addCase(updateTransaction.fulfilled, (state, action: PayloadAction<Transaction>) => {
        const idx = state.items.findIndex((t) => t.id === action.payload.id);
        if (idx >= 0) state.items[idx] = action.payload;
      })
      .addCase(deleteTransaction.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
      })

      // ===== PAGED FETCH =====
      .addCase(fetchTransactionsPaged.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactionsPaged.fulfilled, (state, action: PayloadAction<PagedResponse<Transaction>>) => {
        state.loading = false;
        state.items = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.totalElements = action.payload.totalElements;
        state.page = action.payload.number;
        state.size = action.payload.size;
      })
      .addCase(fetchTransactionsPaged.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load paged transactions";
      })

      // ===== Analytics: Cards =====
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

      // ===== Breakdown =====
      .addCase(fetchCategoryBreakdown.fulfilled, (state, action: PayloadAction<Record<string, number>>) => {
        state.categoryBreakdown = action.payload;
      })
      .addCase(fetchPaymentBreakdown.fulfilled, (state, action: PayloadAction<Record<string, number>>) => {
        state.paymentBreakdown = action.payload;
      })

      // ===== Timeseries =====
      .addCase(fetchTimeseries.fulfilled, (state, action: PayloadAction<TimeseriesResponse["points"]>) => {
        state.timeseries = action.payload;
      })

      // ===== Totals =====
      .addCase(fetchAllTotals.pending, (state) => {
        state.totalsLoading = true;
      })
      .addCase(
        fetchAllTotals.fulfilled,
        (state, action: PayloadAction<{ totalIncome: number; totalExpense: number; totalSaving: number }>) => {
          state.totalsLoading = false;
          state.totalIncome = action.payload.totalIncome;
          state.totalExpense = action.payload.totalExpense;
          state.totalSaving = action.payload.totalSaving;
        }
      )
      .addCase(fetchAllTotals.rejected, (state, action) => {
        state.totalsLoading = false;
        state.chartsError = action.error.message || "Load all totals failed";
      });
  },
});

export default transactionSlice.reducer;
