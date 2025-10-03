import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import masterCategoryReducer from "./slice/masterCategorySlice"; // 👈 thêm slice mới
import userCategoryReducer from "./slice/userCategorySlice"; // 👈 thêm slice mới
import transactionReducer from "./slice/transactionSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    masterCategories: masterCategoryReducer, 
    userCategories: userCategoryReducer,
    transactions: transactionReducer,
  },
});

// Types cho hook
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
