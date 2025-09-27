import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import masterCategoryReducer from "./slice/masterCategorySlice"; // 👈 thêm slice mới

export const store = configureStore({
  reducer: {
    auth: authReducer,
    masterCategories: masterCategoryReducer, 
  },
});

// Types cho hook
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
