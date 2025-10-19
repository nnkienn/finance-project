"use client";

import { useEffect, useState } from "react";
import NavbarPrivate from "@/components/layout/NavbarPrivate";
import CardInfo from "@/components/layout/dashboard/CardInfo";
import ExportMenu from "@/components/layout/transaction/ExportMenu";
import RightSidebar from "@/components/layout/transaction/TransactionRightSidebar";
import TransactionSearchFilter from "@/components/layout/transaction/TransactionSearchFilter";
import TransactionModal from "@/components/layout/transaction/AddTransactionModal";
import TransactionTable from "@/components/layout/transaction/TransactionTable";

import { useAppDispatch } from "@/hook/useAppDispatch";
import { useAppSelector } from "@/hook/useAppSelector";
import {
  createTransaction,
  updateTransaction,
  deleteTransaction,
  fetchTransactionsPaged,
} from "@/store/slice/transactionSlice";
import { fetchUserCategories } from "@/store/slice/userCategorySlice";
import { fetchSavings } from "@/store/slice/savingSlice";

import { Transaction } from "@/type/transaction";
import { transactionExportService } from "@/service/transactionExportService";

export default function TransactionPage() {
  const dispatch = useAppDispatch();

  const {
    items: transactions,
    loading,
    error,
    page,
    totalPages,
    size,
  } = useAppSelector((state) => state.transactions);
  const { items: categories } = useAppSelector((state) => state.userCategories);
  const savings = useAppSelector((state) => state.saving.items);

  const [showModal, setShowModal] = useState(false);
  const [editTx, setEditTx] = useState<Transaction | null>(null);
  const [filters, setFilters] = useState({
    startDate: null as string | null,
    endDate: null as string | null,
    type: null as string | null,
    categoryId: null as number | null,
  });

  // ✅ Load dữ liệu khi mở trang
  useEffect(() => {
    dispatch(fetchUserCategories());
    dispatch(fetchSavings());
    dispatch(
      fetchTransactionsPaged({
        page: 0,
        size,
        sort: "transactionDate,desc",
      })
    );
  }, [dispatch, size]);

  // ✅ Export
  const handleExport = async (type: "csv" | "pdf") => {
    try {
      const blob =
        type === "csv"
          ? await transactionExportService.exportCsv()
          : await transactionExportService.exportPdf();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `transactions.${type}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Export failed", err);
      alert("❌ Export failed. Check console for details.");
    }
  };

  // ✅ Create / Update
  const handleSave = async (payload: Omit<Transaction, "id">) => {
    try {
      if (editTx) {
        await dispatch(updateTransaction({ id: editTx.id!, data: payload })).unwrap();
        alert("✅ Transaction updated successfully!");
      } else {
        await dispatch(createTransaction(payload as any)).unwrap();
        alert("✅ Transaction created successfully!");
      }
      setShowModal(false);
    } catch (err) {
      console.error("Save transaction failed:", err);
      alert("❌ Failed to save transaction.");
    }
  };

  // ✅ Delete
  const handleDelete = async (id: number) => {
    if (confirm("Delete this transaction?")) {
      try {
        await dispatch(deleteTransaction(id)).unwrap();
        alert("🗑️ Transaction deleted successfully!");
      } catch (err) {
        console.error("Delete transaction failed:", err);
        alert("❌ Failed to delete transaction.");
      }
    }
  };

  // ✅ Filter
  const handleFilter = (f: typeof filters) => {
    setFilters(f);
    dispatch(
      fetchTransactionsPaged({
        startDate: f.startDate || undefined,
        endDate: f.endDate || undefined,
        type: f.type as "EXPENSE" | "INCOME" | "SAVING" | undefined,
        categoryId: f.categoryId || undefined,
        page: 0,
        size,
        sort: "transactionDate,desc",
      })
    );
  };

  // ✅ Pagination
  const handlePageChange = (newPage: number) => {
    dispatch(
      fetchTransactionsPaged({
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        type: filters.type as "EXPENSE" | "INCOME" | "SAVING" | undefined,
        categoryId: filters.categoryId || undefined,
        page: newPage,
        size,
        sort: "transactionDate,desc",
      })
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      <NavbarPrivate />

      <main className="flex-1 pt-24 pb-10 px-4 md:px-8 lg:px-12 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-12 gap-x-5 gap-y-6 items-start">
          {/* LEFT CARD */}
          <div className="col-span-12 md:col-span-3">
            <h2 className="text-lg font-semibold mb-3">My Card</h2>
            <CardInfo />
          </div>

          {/* CENTER CONTENT */}
          <div className="col-span-12 md:col-span-9 lg:col-span-6 flex flex-col space-y-6 pt-1">
            {/* Filter */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Search & Filter</h2>
              <TransactionSearchFilter categories={categories} onApply={handleFilter} />
            </div>

            {/* Transaction List */}
            <div className="bg-white rounded-2xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Transaction List</h2>
                <div className="flex items-center gap-3">
                  <ExportMenu onExport={handleExport} />
                  <button
                    onClick={() => {
                      setEditTx(null);
                      setShowModal(true);
                    }}
                    className="px-4 py-2 bg-pink-500 text-white rounded-lg text-sm font-medium hover:bg-pink-600 transition"
                  >
                    + Create
                  </button>
                </div>
              </div>

              {loading && (
                <p className="text-gray-500 text-sm text-center">Loading...</p>
              )}
              {error && <p className="text-red-500 text-sm">{error}</p>}

              <TransactionTable
                transactions={transactions}
                onEdit={(tx) => {
                  setEditTx(tx);
                  setShowModal(true);
                }}
                onDelete={handleDelete}
              />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <button
                    disabled={page <= 0}
                    onClick={() => handlePageChange(page - 1)}
                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-sm"
                  >
                    Prev
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {page + 1} of {totalPages}
                  </span>
                  <button
                    disabled={page >= totalPages - 1}
                    onClick={() => handlePageChange(page + 1)}
                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-sm"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="hidden lg:block lg:col-span-3">
            <RightSidebar />
          </div>
        </div>
      </main>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        initialData={editTx}
        categories={categories}
        savings={savings}
      />
    </div>
  );
}
