// src/store/slice/userCategorySlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { UserCategory } from "@/type/UserCategory";
import * as service from "@/service/userCategoryService";

// =====================
// Async thunks
// =====================
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
// Slice
// =====================
interface UserCategoryState {
  items: UserCategory[];
  loading: boolean;
  error: string | null;
}

const initialState: UserCategoryState = {
  items: [],
  loading: false,
  error: null,
};

const userCategorySlice = createSlice({
  name: "userCategories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchAll
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

      // fetchByMaster
      .addCase(
        fetchUserCategoriesByMaster.fulfilled,
        (state, action: PayloadAction<UserCategory[]>) => {
          state.items = action.payload;
        }
      )

      // create
      .addCase(
        addUserCategory.fulfilled,
        (state, action: PayloadAction<UserCategory>) => {
          state.items.push(action.payload);
        }
      )

      // update
      .addCase(
        editUserCategory.fulfilled,
        (state, action: PayloadAction<UserCategory>) => {
          const idx = state.items.findIndex((c) => c.id === action.payload.id);
          if (idx >= 0) state.items[idx] = action.payload;
        }
      )

      // delete
      .addCase(
        removeUserCategory.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.items = state.items.filter((c) => c.id !== action.payload);
        }
      )

      // filter
      .addCase(
        filterUserCategory.fulfilled,
        (state, action: PayloadAction<UserCategory[]>) => {
          state.items = action.payload;
        }
      )

      // search
      .addCase(
        searchUserCategory.fulfilled,
        (state, action: PayloadAction<UserCategory[]>) => {
          state.items = action.payload;
        }
      )

      // import default
      .addCase(
        importDefaultUserCategory.fulfilled,
        (state, action: PayloadAction<UserCategory[]>) => {
          state.items = action.payload;
        }
      );
  },
});

export default userCategorySlice.reducer;
