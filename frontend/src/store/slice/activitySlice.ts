import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ActivityService, AuditLog } from "@/service/activityService";

interface ActivityState {
  items: AuditLog[];
  loading: boolean;
  error: string | null;
}

const initialState: ActivityState = {
  items: [],
  loading: false,
  error: null,
};

// 📦 Lấy toàn bộ activity logs
export const fetchActivities = createAsyncThunk(
  "activity/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await ActivityService.getAll();
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch activity logs");
    }
  }
);

// 📦 Lấy activity theo loại entity (SavingGoal, Transaction, ...)
export const fetchActivitiesByType = createAsyncThunk(
  "activity/fetchByType",
  async (entityType: string, { rejectWithValue }) => {
    try {
      const res = await ActivityService.getByType(entityType);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch by entityType");
    }
  }
);

// 📦 Lấy chi tiết 1 activity cụ thể
export const fetchActivityById = createAsyncThunk(
  "activity/fetchById",
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await ActivityService.getById(id);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch activity detail");
    }
  }
);

const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    clearActivities: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivities.fulfilled, (state, action: PayloadAction<AuditLog[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch by type
      .addCase(fetchActivitiesByType.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchActivitiesByType.fulfilled, (state, action: PayloadAction<AuditLog[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchActivitiesByType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch by ID (optional)
      .addCase(fetchActivityById.fulfilled, (state, action: PayloadAction<AuditLog>) => {
        const existing = state.items.find((x) => x.id === action.payload.id);
        if (!existing) {
          state.items.unshift(action.payload);
        }
      });
  },
});

export const { clearActivities } = activitySlice.actions;
export default activitySlice.reducer;
