// src/service/transactionExportService.ts
import api from "./apiService";

const EXPORT_URL = "/api/transactions/export";

export const transactionExportService = {
  async exportCsv(): Promise<Blob> {
    const res = await api.get(`${EXPORT_URL}/csv`, {
      responseType: "blob", // 👈 để nhận file
    });
    return res.data;
  },

  async exportPdf(): Promise<Blob> {
    const res = await api.get(`${EXPORT_URL}/pdf`, {
      responseType: "blob",
    });
    return res.data;
  },
};
