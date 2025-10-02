"use client";

import { useState } from "react";
import { Transaction } from "@/type/transaction";
import NavbarPrivate from "@/components/layout/NavbarPrivate";
import CardInfo from "@/components/layout/dashboard/CardInfo";
import RightSidebar from "@/components/layout/transaction/TransactionRightSidebar";
import TransactionSearchFilter from "@/components/layout/transaction/TransactionSearchFilter";
import TransactionModal from "@/components/layout/transaction/TransactionModal";
import { Pencil } from "lucide-react";

export default function Homepage() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      description: "Lương tháng 9",
      amount: 8000000,
      date: "2025-09-10",
      type: "EXPENSE",
      category: "Salary",
      paymentMethod: "Bank",
    },
    {
      id: 2,
      description: "Freelance project",
      amount: 2500000,
      date: "2025-09-12",
      type: "INCOME",
      category: "Work",
      paymentMethod: "Cash",
    },
  ]);

  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editTx, setEditTx] = useState<Transaction | null>(null);

  // xuất file
  const handleExport = (type: "csv" | "pdf") => {
    console.log("Exporting as:", type);
    setShowExportMenu(false);
  };

  // lưu transaction (tạo mới hoặc update)
  const handleSave = (tx: Transaction) => {
    if (tx.id) {
      // update
      setTransactions((prev) =>
        prev.map((t) => (t.id === tx.id ? { ...tx } : t))
      );
    } else {
      // create
      setTransactions((prev) => [
        ...prev,
        { ...tx, id: prev.length ? prev[prev.length - 1].id! + 1 : 1 },
      ]);
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
                }}
              />
            </div>

            {/* Transaction List */}
            <div className="bg-white rounded-2xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Transaction List</h2>
                <div className="flex items-center gap-3">
                  {/* Export */}
                  <div className="relative">
                    <button
                      onClick={() => setShowExportMenu(!showExportMenu)}
                      className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
                    >
                      Export ⬇
                    </button>
                    {showExportMenu && (
                      <div className="absolute right-0 mt-2 w-36 bg-white border rounded-lg shadow-lg z-20">
                        <button
                          onClick={() => handleExport("csv")}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Export CSV
                        </button>
                        <button
                          onClick={() => handleExport("pdf")}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Export PDF
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Create */}
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
                          {new Date(tx.date).toLocaleDateString("vi-VN")}
                        </td>
                        <td className="px-4 py-3 truncate">{tx.description}</td>
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
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => {
                              setEditTx(tx);
                              setShowModal(true);
                            }}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <Pencil size={16} />
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

      {/* Modal */}
      <TransactionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        initialData={editTx}
      />
    </div>
  );
}
