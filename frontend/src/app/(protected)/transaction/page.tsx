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

// saving slice
import { fetchSavings } from "@/store/slice/savingSlice";

import { Transaction } from "@/type/transaction";
import { transactionExportService } from "@/service/transactionExportService";

export default function Homepage() {
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

  // get savings from saving slice
  const savings = useAppSelector((state) => state.saving.items);

  const [showModal, setShowModal] = useState(false);
  const [editTx, setEditTx] = useState<Transaction | null>(null);

  // filter state để nhớ khi đổi trang
  const [filters, setFilters] = useState<{
    startDate: string | null;
    endDate: string | null;
    type: string | null;
    categoryId: number | null;
  }>({
    startDate: null,
    endDate: null,
    type: null,
    categoryId: null,
  });

  useEffect(() => {
    // load categories + savings + first page of transactions
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

  const handleExport = async (type: "csv" | "pdf") => {
    try {
      const blob =
        type === "csv"
          ? await transactionExportService.exportCsv()
          : await transactionExportService.exportPdf();

      // Tạo link tải file
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
      alert("❌ Failed to save transaction. Check console for details.");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Delete this transaction?")) {
      try {
        await dispatch(deleteTransaction(id)).unwrap();
        alert("🗑️ Transaction deleted successfully!");
      } catch (err) {
        console.error("Delete transaction failed:", err);
        alert("❌ Failed to delete transaction. Check console for details.");
      }
    }
  };

  // ✅ filter handler (convert null → undefined)
  const handleFilter = (f: {
    startDate: string | null;
    endDate: string | null;
    type: string | null;
    categoryId: number | null;
  }) => {
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

  // ✅ đổi trang (giữ filter cũ)
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
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <NavbarPrivate />

      <main className="pt-24 px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-12 gap-6">
          {/* LEFT: My Card */}
          <div className="col-span-12 md:col-span-3">
            <h2 className="text-lg font-semibold mb-4">My Card</h2>
            <CardInfo/>
          </div>

          {/* CENTER */}
          <div className="col-span-12 md:col-span-6 space-y-6">
            {/* Filter */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Search & Filter</h2>
              <TransactionSearchFilter categories={categories} onApply={handleFilter} />
            </div>

            {/* Transaction Section */}
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
                    + Create Transaction
                  </button>
                </div>
              </div>

              {loading && <p className="text-gray-500">Loading...</p>}
              {error && <p className="text-red-500">{error}</p>}

              <TransactionTable
                transactions={transactions}
                onEdit={(tx) => {
                  setEditTx(tx);
                  setShowModal(true);
                }}
                onDelete={handleDelete}
              />

              {/* Pagination */}
              <div className="flex justify-center items-center gap-2 mt-4">
                <button
                  disabled={page <= 0}
                  onClick={() => handlePageChange(page - 1)}
                  className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="text-sm text-gray-600">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages - 1}
                  onClick={() => handlePageChange(page + 1)}
                  className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-span-12 md:col-span-3">
            <RightSidebar />
          </div>
        </div>
      </main>

      {/* Modal */}
      <TransactionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        initialData={editTx}
        categories={categories}
        savings={savings} // <-- truyền danh sách saving goals vào modal
      />
    </div>
  );
}
