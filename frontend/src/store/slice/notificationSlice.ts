import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  NotificationService,
  NotificationItem,
} from "@/service/notificationService";

interface NotificationState {
  items: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  items: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

// 🔹 Fetch tất cả thông báo
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const data = await NotificationService.getAll();
      // ✅ sort giảm dần theo createdAt
      return data.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to load notifications");
    }
  }
);

// 🔹 Mark 1 thông báo đã đọc
export const markNotificationRead = createAsyncThunk(
  "notifications/markRead",
  async (id: number, { rejectWithValue }) => {
    try {
      return await NotificationService.markRead(id);
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to mark as read");
    }
  }
);

// 🔹 Mark tất cả là đã đọc
export const markAllNotificationsRead = createAsyncThunk(
  "notifications/markAllRead",
  async (_, { rejectWithValue }) => {
    try {
      return await NotificationService.markAllRead();
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to mark all as read");
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    // 🔔 thêm noti mới từ WebSocket
    addNotification: (state, action: PayloadAction<NotificationItem>) => {
      const exists = state.items.some((n) => n.id === action.payload.id);
      if (!exists) {
        state.items.unshift(action.payload);
        if (!action.payload.isRead) state.unreadCount += 1;

        // ✅ giữ danh sách không quá dài (giới hạn 50 items)
        if (state.items.length > 50) state.items.pop();
      }
    },

    // 🔄 clear toàn bộ (khi logout)
    clearNotifications: (state) => {
      state.items = [];
      state.unreadCount = 0;
    },
  },

  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.unreadCount = action.payload.filter((n) => !n.isRead).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // MARK ONE
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const updated = action.payload;
        const notif = state.items.find((n) => n.id === updated.id);
        if (notif) notif.isRead = true;
        state.unreadCount = state.items.filter((n) => !n.isRead).length;
      })

      // MARK ALL
      .addCase(markAllNotificationsRead.fulfilled, (state, action) => {
        state.items = action.payload;
        state.unreadCount = 0;
      });
  },
});

export const { addNotification, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
