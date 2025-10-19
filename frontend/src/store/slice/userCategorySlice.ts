// src/store/slice/userCategorySlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { UserCategory } from "@/type/UserCategory";
import * as service from "@/service/userCategoryService";

// =====================
// Async thunks
// =====================

// CRUD cơ bản
export const fetchUserCategories = createAsyncThunk(
  "userCategories/fetchAll",
  async () => await service.getUserCategories()
);

export const fetchUserCategoriesByMaster = createAsyncThunk(
  "userCategories/fetchByMaster",
  async (masterId: number) => await service.getUserCategoriesByMaster(masterId)
);

export const addUserCategory = createAsyncThunk(
  "userCategories/create",
  async (data: { name: string; icon?: string; masterCategoryId: number }) =>
    await service.createUserCategory(data)
);

export const editUserCategory = createAsyncThunk(
  "userCategories/update",
  async ({
    id,
    data,
  }: {
    id: number;
    data: { name: string; icon?: string; masterCategoryId: number };
  }) => await service.updateUserCategory(id, data)
);

export const removeUserCategory = createAsyncThunk(
  "userCategories/delete",
  async (id: number) => await service.deleteUserCategory(id)
);

export const filterUserCategory = createAsyncThunk(
  "userCategories/filter",
  async (type: "EXPENSE" | "INCOME" | "SAVING") =>
    await service.filterUserCategories(type)
);

export const searchUserCategory = createAsyncThunk(
  "userCategories/search",
  async (keyword: string) => await service.searchUserCategories(keyword)
);

export const importDefaultUserCategory = createAsyncThunk(
  "userCategories/importDefault",
  async () => {
    await service.importDefaultCategories();
    return await service.getUserCategories();
  }
);

// =====================
// Dashboard Thunks
// =====================

// Chi tiêu theo danh mục (donut)
export const fetchExpensesByCategory = createAsyncThunk(
  "userCategories/expensesByCategory",
  async (params?: { month?: number; year?: number }) =>
    await service.getExpensesByCategory(params?.month, params?.year)
);

// Top danh mục chi tiêu
export const fetchTopExpenseCategories = createAsyncThunk(
  "userCategories/topExpenseCategories",
  async (params?: { month?: number; year?: number; limit?: number }) =>
    await service.getTopExpenseCategories(
      params?.month,
      params?.year,
      params?.limit || 3
    )
);

// Đếm số lượng category theo type
export const fetchCountByType = createAsyncThunk(
  "userCategories/countByType",
  async () => await service.countUserCategoriesByType()
);

// =====================
// Slice
// =====================

interface UserCategoryState {
  items: UserCategory[];
  loading: boolean;
  error: string | null;
  expensesByCategory: { name: string; amount: number }[];
  topExpenseCategories: { name: string; amount: number }[];
  countByType: Record<string, number>;
}

const initialState: UserCategoryState = {
  items: [],
  loading: false,
  error: null,
  expensesByCategory: [],
  topExpenseCategories: [],
  countByType: {},
};

const userCategorySlice = createSlice({
  name: "userCategories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // =====================
      // CRUD
      // =====================
      .addCase(fetchUserCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserCategories.fulfilled,
        (state, action: PayloadAction<UserCategory[]>) => {
          state.loading = false;
          state.items = action.payload;
        }
      )
      .addCase(fetchUserCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load user categories";
      })

      .addCase(
        fetchUserCategoriesByMaster.fulfilled,
        (state, action: PayloadAction<UserCategory[]>) => {
          state.items = action.payload;
        }
      )

      .addCase(
        addUserCategory.fulfilled,
        (state, action: PayloadAction<UserCategory>) => {
          state.items.push(action.payload);
        }
      )

      .addCase(
        editUserCategory.fulfilled,
        (state, action: PayloadAction<UserCategory>) => {
          const idx = state.items.findIndex((c) => c.id === action.payload.id);
          if (idx >= 0) state.items[idx] = action.payload;
        }
      )

      .addCase(
        removeUserCategory.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.items = state.items.filter((c) => c.id !== action.payload);
        }
      )

      .addCase(
        filterUserCategory.fulfilled,
        (state, action: PayloadAction<UserCategory[]>) => {
          state.items = action.payload;
        }
      )

      .addCase(
        searchUserCategory.fulfilled,
        (state, action: PayloadAction<UserCategory[]>) => {
          state.items = action.payload;
        }
      )

      .addCase(
        importDefaultUserCategory.fulfilled,
        (state, action: PayloadAction<UserCategory[]>) => {
          state.items = action.payload;
        }
      )

      // =====================
      // Dashboard reducers
      // =====================
      .addCase(
        fetchExpensesByCategory.fulfilled,
        (state, action: PayloadAction<{ name: string; amount: number }[]>) => {
          state.expensesByCategory = action.payload;
        }
      )

      .addCase(
        fetchTopExpenseCategories.fulfilled,
        (state, action: PayloadAction<{ name: string; amount: number }[]>) => {
          state.topExpenseCategories = action.payload;
        }
      )

      .addCase(
        fetchCountByType.fulfilled,
        (state, action: PayloadAction<Record<string, number>>) => {
          state.countByType = action.payload;
        }
      );
  },
});

export default userCategorySlice.reducer;
