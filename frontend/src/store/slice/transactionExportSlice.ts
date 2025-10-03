// src/store/slice/transactionExportSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { transactionExportService } from "@/service/transactionExportService";

export const exportCsv = createAsyncThunk("transactions/exportCsv", async () => {
  return await transactionExportService.exportCsv();
});

export const exportPdf = createAsyncThunk("transactions/exportPdf", async () => {
  return await transactionExportService.exportPdf();
});

interface ExportState {
  loading: boolean;
  error: string | null;
}

const initialState: ExportState = {
  loading: false,
  error: null,
};

const exportSlice = createSlice({
  name: "transactionExport",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(exportCsv.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(exportCsv.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(exportCsv.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to export CSV";
      })
      .addCase(exportPdf.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(exportPdf.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(exportPdf.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to export PDF";
      });
  },
});

export default exportSlice.reducer;
