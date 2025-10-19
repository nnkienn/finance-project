import api from "./apiService";

export interface AuditLog {
  id: number;
  userId: number;
  action: string;
  entityType: string;
  entityId: string;
  payload: any;
  createdAt: string;
}

/**
 * Service xử lý Audit Log (Activity)
 */
export const ActivityService = {
  // 📜 Lấy toàn bộ activity của user hiện tại
  async getAll(): Promise<AuditLog[]> {
    const res = await api.get<AuditLog[]>("/api/audit-logs");
    return res.data;
  },

  // 🔍 Lấy activity theo loại thực thể (vd: Transaction, SavingGoal, Category)
  async getByType(entityType: string): Promise<AuditLog[]> {
    const res = await api.get<AuditLog[]>(`/api/audit-logs?entityType=${entityType}`);
    return res.data;
  },

  // 🧩 Lấy chi tiết 1 log cụ thể
  async getById(id: number): Promise<AuditLog> {
    const res = await api.get<AuditLog>(`/api/audit-logs/${id}`);
    return res.data;
  },
};
