// src/store/masterCategorySlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { MasterCategory } from "@/type/Mastercategory";
import * as service from "@/service/masterCategoryService";

// =====================
// Async thunks
// =====================
export const fetchMasterCategories = createAsyncThunk(
  "masterCategories/fetchAll",
  async (type?: "EXPENSE" | "INCOME" | "SAVING") => {
    return await service.getMasterCategories(type);
  }
);

export const fetchMasterCategory = createAsyncThunk(
  "masterCategories/fetchById",
  async (id: number) => {
    return await service.getMasterCategoryById(id);
  }
);

export const addMasterCategory = createAsyncThunk(
  "masterCategories/create",
  async (data: Omit<MasterCategory, "id">) => {
    return await service.createMasterCategory(data);
  }
);

export const editMasterCategory = createAsyncThunk(
  "masterCategories/update",
  async ({ id, data }: { id: number; data: Omit<MasterCategory, "id"> }) => {
    return await service.updateMasterCategory(id, data);
  }
);

export const removeMasterCategory = createAsyncThunk(
  "masterCategories/delete",
  async (id: number) => {
    return await service.deleteMasterCategory(id);
  }
);

// =====================
// Slice
// =====================
interface MasterCategoryState {
  items: MasterCategory[];
  loading: boolean;
  error: string | null;
}

const initialState: MasterCategoryState = {
  items: [],
  loading: false,
  error: null,
};

const masterCategorySlice = createSlice({
  name: "masterCategories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchAll
      .addCase(fetchMasterCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMasterCategories.fulfilled, (state, action: PayloadAction<MasterCategory[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMasterCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load categories";
      })
      // create
      .addCase(addMasterCategory.fulfilled, (state, action: PayloadAction<MasterCategory>) => {
        state.items.push(action.payload);
      })
      // update
      .addCase(editMasterCategory.fulfilled, (state, action: PayloadAction<MasterCategory>) => {
        const idx = state.items.findIndex((c) => c.id === action.payload.id);
        if (idx >= 0) state.items[idx] = action.payload;
      })
      // delete
      .addCase(removeMasterCategory.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
      });
  },
});

export default masterCategorySlice.reducer;
