import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import {
  savingAnalyticsService,
  SavingSummary,
  SavingGoalProgress,
  SavingTrendPoint,
} from "@/service/savingAnalyticsService";

type Status = "idle" | "loading" | "succeeded" | "failed";

interface SavingAnalyticsState {
  summary?: SavingSummary | null;
  progress: SavingGoalProgress[];
  trend: SavingTrendPoint[];
  loading: Status;
  error?: string | null;
}

const initialState: SavingAnalyticsState = {
  summary: null,
  progress: [],
  trend: [],
  loading: "idle",
  error: null,
};

// === Thunks ===
export const fetchSavingSummary = createAsyncThunk(
  "savingAnalytics/fetchSummary",
  async (_, { rejectWithValue }) => {
    try {
      return await savingAnalyticsService.getSummary();
    } catch (e: any) {
      return rejectWithValue(e?.response?.data || e.message);
    }
  }
);

export const fetchSavingProgress = createAsyncThunk(
  "savingAnalytics/fetchProgress",
  async (_, { rejectWithValue }) => {
    try {
      return await savingAnalyticsService.getProgress();
    } catch (e: any) {
      return rejectWithValue(e?.response?.data || e.message);
    }
  }
);

export const fetchSavingTrend = createAsyncThunk(
  "savingAnalytics/fetchTrend",
  async (granularity: "MONTHLY" | "WEEKLY" = "MONTHLY", { rejectWithValue }) => {
    try {
      return await savingAnalyticsService.getTrend(granularity);
    } catch (e: any) {
      return rejectWithValue(e?.response?.data || e.message);
    }
  }
);

const savingAnalyticsSlice = createSlice({
  name: "savingAnalytics",
  initialState,
  reducers: {
    clearSavingAnalyticsError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSavingSummary.pending, (state) => {
        state.loading = "loading";
        state.error = null;
      })
      .addCase(fetchSavingSummary.fulfilled, (state, action: PayloadAction<SavingSummary>) => {
        state.loading = "succeeded";
        state.summary = action.payload;
      })
      .addCase(fetchSavingSummary.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchSavingProgress.fulfilled, (state, action: PayloadAction<SavingGoalProgress[]>) => {
        state.progress = action.payload;
      })
      .addCase(fetchSavingTrend.fulfilled, (state, action: PayloadAction<SavingTrendPoint[]>) => {
        state.trend = action.payload;
      });
  },
});

export const { clearSavingAnalyticsError } = savingAnalyticsSlice.actions;
export default savingAnalyticsSlice.reducer;

// === SELECTORS ===
export const selectSavingSummary = (state: RootState) => state.savingAnalytics.summary;
export const selectSavingProgress = (state: RootState) => state.savingAnalytics.progress; // ✅ thêm dòng này
export const selectSavingTrend = (state: RootState) => state.savingAnalytics.trend;       // (tùy chọn)
export const selectSavingAnalyticsLoading = (state: RootState) => state.savingAnalytics.loading;
