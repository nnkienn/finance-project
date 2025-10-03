"use client";

import { useEffect, useState } from "react";
import NavbarPrivate from "@/components/layout/NavbarPrivate";
import CardInfo from "@/components/layout/dashboard/CardInfo";
import RightSidebar from "@/components/layout/transaction/TransactionRightSidebar";
import TransactionSearchFilter from "@/components/layout/transaction/TransactionSearchFilter";
import ExportMenu from "@/components/layout/transaction/ExportMenu";
import TransactionModal from "@/components/layout/transaction/TransactionModal";
import { Pencil } from "lucide-react";

import { useAppDispatch } from "@/hook/useAppDispatch";
import { useAppSelector } from "@/hook/useAppSelector";
import {
  fetchTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "@/store/slice/transactionSlice";
import { Transaction } from "@/type/transaction";

export default function Homepage() {
  const dispatch = useAppDispatch();
  const { items: transactions, loading, error } = useAppSelector(
    (state) => state.transactions
  );

  const [showModal, setShowModal] = useState(false);
  const [editTx, setEditTx] = useState<Transaction | null>(null);

  // Load transactions khi page mở
  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  // Export
  const handleExport = (type: "csv" | "pdf") => {
    console.log("Exporting as:", type);
  };

  // Save transaction (create or update)
  const handleSave = async (payload: Omit<Transaction, "id">) => {
    try {
      if (editTx) {
        await dispatch(
          updateTransaction({ id: editTx.id!, data: payload })
        ).unwrap();
      } else {
        await dispatch(createTransaction(payload)).unwrap();
      }
      setShowModal(false);
    } catch (err) {
      console.error("Save transaction failed:", err);
    }
  };

  // Delete transaction
  const handleDelete = async (id: number) => {
    if (confirm("Delete this transaction?")) {
      await dispatch(deleteTransaction(id)).unwrap();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <NavbarPrivate />
      <main className="pt-24 px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* LEFT */}
          <div className="md:col-span-3">
            <h2 className="text-lg font-semibold mb-4">My Card</h2>
            <CardInfo
              name="Knance"
              number="1234 1234 1234 1234"
              holder="OMI GUSTY"
              expiry="06/24"
              balance={128320}
              up={23.12}
              down={23.12}
              currency="USD / US Dollar"
              status="Active"
            />
          </div>

          {/* CENTER */}
          <div className="md:col-span-6 space-y-6">
            {/* Filter box */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-lg font-semibold mb-6">Transaction</h2>
              <TransactionSearchFilter
                onApply={(filters) => {
                  console.log("Filters applied:", filters);
                  // sau này sẽ dispatch fetchTransactionsFiltered
                }}
              />
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
                    + Create Transaction
                  </button>
                </div>
              </div>

              {loading && <p className="text-gray-500">Loading...</p>}
              {error && <p className="text-red-500">{error}</p>}

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full table-fixed text-sm text-left text-gray-600">
                  <thead className="text-xs text-gray-500 uppercase border-b">
                    <tr>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Note</th>
                      <th className="px-4 py-3">Payment</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3 text-right">Amount</th>
                      <th className="px-4 py-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr
                        key={tx.id}
                        className="border-b last:border-0 hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          {new Date(tx.transactionDate).toLocaleDateString("vi-VN")}
                        </td>
                        <td className="px-4 py-3 truncate">{tx.note}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium">
                            {tx.paymentMethod}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-md text-xs font-medium ${
                              tx.type === "EXPENSE"
                                ? "bg-red-100 text-red-600"
                                : tx.type === "INCOME"
                                ? "bg-green-100 text-green-600"
                                : "bg-yellow-100 text-yellow-600"
                            }`}
                          >
                            {tx.type}
                          </span>
                        </td>
                        <td
                          className={`px-4 py-3 text-right font-semibold ${
                            tx.type === "EXPENSE"
                              ? "text-red-500"
                              : "text-green-600"
                          }`}
                        >
                          {tx.amount.toLocaleString("vi-VN")}đ
                        </td>
                        <td className="px-4 py-3 text-center flex gap-2 justify-center">
                          <button
                            onClick={() => {
                              setEditTx(tx);
                              setShowModal(true);
                            }}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(tx.id!)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            X
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="md:col-span-3">
            <RightSidebar />
          </div>
        </div>
      </main>

      {/* Modal (dispatch create/update) */}
      <TransactionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        initialData={editTx}
      />
    </div>
  );
}
