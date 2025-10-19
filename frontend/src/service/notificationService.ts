import api from "./apiService";

export interface NotificationItem {
  id: number;
  type: string;
  title: string;
  body: string;
  status: "PENDING" | "SENT" | "FAILED";
  isRead: boolean;
  createdAt: string;
  sentAt?: string | null;
  payload?: any;
}

export const NotificationService = {
  // 🔹 Lấy danh sách thông báo của user hiện tại
  async getAll(): Promise<NotificationItem[]> {
    const res = await api.get<NotificationItem[]>("/api/notifications");
    return res.data;
  },

  // 🔹 Đánh dấu 1 thông báo là đã đọc
  async markRead(id: number): Promise<NotificationItem> {
    const res = await api.patch<NotificationItem>(`/api/notifications/${id}/read`);
    return res.data;
  },

  // 🔹 Đánh dấu tất cả là đã đọc
  async markAllRead(): Promise<NotificationItem[]> {
    const res = await api.patch<NotificationItem[]>("/api/notifications/read-all");
    return res.data;
  },
};
