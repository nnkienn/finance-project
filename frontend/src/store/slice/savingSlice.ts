// src/store/slice/savingSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import { savingService, SavingGoalRequest, SavingGoalResponse, SavingGoalUpdateRequest } from "@/service/savingService";

type Status = "idle" | "loading" | "succeeded" | "failed";

interface SavingState {
  items: SavingGoalResponse[];
  current?: SavingGoalResponse | null;
  loading: Status;
  error?: string | null;
}

const initialState: SavingState = {
  items: [],
  current: null,
  loading: "idle",
  error: null,
};

// Thunks
export const fetchSavings = createAsyncThunk("saving/fetchSavings", async (_, { rejectWithValue }) => {
  try {
    return await savingService.list();
  } catch (e: any) {
    return rejectWithValue(e?.response?.data || e.message);
  }
});

export const fetchSavingDetail = createAsyncThunk("saving/fetchSavingDetail", async (id: number, { rejectWithValue }) => {
  try {
    return await savingService.detail(id);
  } catch (e: any) {
    return rejectWithValue(e?.response?.data || e.message);
  }
});

export const createSaving = createAsyncThunk("saving/createSaving", async (payload: SavingGoalRequest, { rejectWithValue }) => {
  try {
    return await savingService.create(payload);
  } catch (e: any) {
    return rejectWithValue(e?.response?.data || e.message);
  }
});

export const updateSaving = createAsyncThunk(
  "saving/updateSaving",
  async ({ id, data }: { id: number; data: SavingGoalUpdateRequest }, { rejectWithValue }) => {
    try {
      return await savingService.update(id, data);
    } catch (e: any) {
      return rejectWithValue(e?.response?.data || e.message);
    }
  }
);

export const deleteSaving = createAsyncThunk("saving/deleteSaving", async (id: number, { rejectWithValue }) => {
  try {
    await savingService.remove(id);
    return id;
  } catch (e: any) {
    return rejectWithValue(e?.response?.data || e.message);
  }
});

const savingSlice = createSlice({
  name: "saving",
  initialState,
  reducers: {
    clearSavingError(state) {
      state.error = null;
    },
    setCurrentSaving(state, action: PayloadAction<SavingGoalResponse | null>) {
      state.current = action.payload;
    },
  },
  extraReducers: (builder) => {
    // fetch list
    builder.addCase(fetchSavings.pending, (state) => {
      state.loading = "loading";
      state.error = null;
    });
    builder.addCase(fetchSavings.fulfilled, (state, action: PayloadAction<SavingGoalResponse[]>) => {
      state.loading = "succeeded";
      state.items = action.payload;
    });
    builder.addCase(fetchSavings.rejected, (state, action) => {
      state.loading = "failed";
      state.error = action.payload as string;
    });

    // detail
    builder.addCase(fetchSavingDetail.pending, (state) => {
      state.loading = "loading";
      state.current = null;
      state.error = null;
    });
    builder.addCase(fetchSavingDetail.fulfilled, (state, action: PayloadAction<SavingGoalResponse>) => {
      state.loading = "succeeded";
      state.current = action.payload;
    });
    builder.addCase(fetchSavingDetail.rejected, (state, action) => {
      state.loading = "failed";
      state.error = action.payload as string;
    });

    // create
    builder.addCase(createSaving.pending, (state) => {
      state.loading = "loading";
      state.error = null;
    });
    builder.addCase(createSaving.fulfilled, (state, action: PayloadAction<SavingGoalResponse>) => {
      state.loading = "succeeded";
      // push new to top
      state.items = [action.payload, ...state.items];
      state.current = action.payload;
    });
    builder.addCase(createSaving.rejected, (state, action) => {
      state.loading = "failed";
      state.error = action.payload as string;
    });

    // update
    builder.addCase(updateSaving.pending, (state) => {
      state.loading = "loading";
      state.error = null;
    });
    builder.addCase(updateSaving.fulfilled, (state, action: PayloadAction<SavingGoalResponse>) => {
      state.loading = "succeeded";
      state.items = state.items.map((s) => (s.id === action.payload.id ? action.payload : s));
      if (state.current && state.current.id === action.payload.id) state.current = action.payload;
    });
    builder.addCase(updateSaving.rejected, (state, action) => {
      state.loading = "failed";
      state.error = action.payload as string;
    });

    // delete
    builder.addCase(deleteSaving.pending, (state) => {
      state.loading = "loading";
      state.error = null;
    });
    builder.addCase(deleteSaving.fulfilled, (state, action: PayloadAction<number>) => {
      state.loading = "succeeded";
      state.items = state.items.filter((s) => s.id !== action.payload);
      if (state.current?.id === action.payload) state.current = null;
    });
    builder.addCase(deleteSaving.rejected, (state, action) => {
      state.loading = "failed";
      state.error = action.payload as string;
    });
  },
});

export const { clearSavingError, setCurrentSaving } = savingSlice.actions;

export default savingSlice.reducer;

// Selectors
export const selectAllSavings = (state: RootState) => state.saving.items;
export const selectSavingById = (id?: number) => (state: RootState) => state.saving.items.find((s) => s.id === id);
export const selectCurrentSaving = (state: RootState) => state.saving.current;
export const selectSavingLoading = (state: RootState) => state.saving.loading;
export const selectSavingError = (state: RootState) => state.saving.error;
