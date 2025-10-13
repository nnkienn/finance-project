import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import {
  savingReportService,
  SavingMonthlyReport,
  SavingGoalSummary,
} from "@/service/savingReportService";

type Status = "idle" | "loading" | "succeeded" | "failed";

interface SavingReportState {
  monthly: SavingMonthlyReport[];
  topGoals: SavingGoalSummary[];
  failedGoals: SavingGoalSummary[];
  loading: Status;
  error?: string | null;
}

const initialState: SavingReportState = {
  monthly: [],
  topGoals: [],
  failedGoals: [],
  loading: "idle",
  error: null,
};

// === Thunks ===
export const fetchSavingMonthly = createAsyncThunk(
  "savingReport/fetchMonthly",
  async (_, { rejectWithValue }) => {
    try {
      return await savingReportService.getMonthly();
    } catch (e: any) {
      return rejectWithValue(e?.response?.data || e.message);
    }
  }
);

export const fetchSavingTopGoals = createAsyncThunk(
  "savingReport/fetchTopGoals",
  async (_, { rejectWithValue }) => {
    try {
      return await savingReportService.getTopGoals();
    } catch (e: any) {
      return rejectWithValue(e?.response?.data || e.message);
    }
  }
);

export const fetchSavingFailedGoals = createAsyncThunk(
  "savingReport/fetchFailedGoals",
  async (_, { rejectWithValue }) => {
    try {
      return await savingReportService.getFailedGoals();
    } catch (e: any) {
      return rejectWithValue(e?.response?.data || e.message);
    }
  }
);

// === Slice ===
const savingReportSlice = createSlice({
  name: "savingReport",
  initialState,
  reducers: {
    clearSavingReportError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Monthly
      .addCase(fetchSavingMonthly.pending, (state) => {
        state.loading = "loading";
        state.error = null;
      })
      .addCase(fetchSavingMonthly.fulfilled, (state, action: PayloadAction<SavingMonthlyReport[]>) => {
        state.loading = "succeeded";
        state.monthly = action.payload;
      })
      .addCase(fetchSavingMonthly.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      })

      // Top goals
      .addCase(fetchSavingTopGoals.fulfilled, (state, action: PayloadAction<SavingGoalSummary[]>) => {
        state.topGoals = action.payload;
      })

      // Failed goals
      .addCase(fetchSavingFailedGoals.fulfilled, (state, action: PayloadAction<SavingGoalSummary[]>) => {
        state.failedGoals = action.payload;
      });
  },
});

export const { clearSavingReportError } = savingReportSlice.actions;
export default savingReportSlice.reducer;

// === Selectors ===
export const selectSavingMonthly = (state: RootState) => state.savingReport.monthly;
export const selectSavingTopGoals = (state: RootState) => state.savingReport.topGoals;
export const selectSavingFailedGoals = (state: RootState) => state.savingReport.failedGoals;
export const selectSavingReportLoading = (state: RootState) => state.savingReport.loading;
export const selectSavingReportError = (state: RootState) => state.savingReport.error;
