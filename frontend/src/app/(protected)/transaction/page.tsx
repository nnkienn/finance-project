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
  fetchTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "@/store/slice/transactionSlice";
import { fetchUserCategories } from "@/store/slice/userCategorySlice";
import { Transaction } from "@/type/transaction";

export default function Homepage() {
  const dispatch = useAppDispatch();
  const { items: transactions, loading, error } = useAppSelector(
    (state) => state.transactions
  );
  const { items: categories } = useAppSelector((state) => state.userCategories);

  const [showModal, setShowModal] = useState(false);
  const [editTx, setEditTx] = useState<Transaction | null>(null);

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchUserCategories()); // load category cho dropdown
  }, [dispatch]);

  const handleExport = (type: "csv" | "pdf") => {
    console.log("Exporting as:", type);
  };

  const handleSave = async (payload: Omit<Transaction, "id">) => {
    try {
      if (editTx) {
        await dispatch(
          updateTransaction({ id: editTx.id!, data: payload })
        ).unwrap();
        alert("✅ Transaction updated successfully!");
      } else {
        await dispatch(createTransaction(payload)).unwrap();
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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <NavbarPrivate />

      <main className="pt-24 px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-12 gap-6">
          {/* LEFT: My Card */}
          <div className="col-span-12 md:col-span-3">
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
          <div className="col-span-12 md:col-span-6 space-y-6">
            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
              {/* Balance */}
              <div className="bg-white rounded-xl shadow p-4 border-l-4 border-blue-500 h-full flex flex-col justify-center">
                <p className="text-sm text-gray-500">My Balance</p>
                <p className="text-xl font-bold">$128,320</p>
              </div>

              {/* Income */}
              <div className="bg-white rounded-xl shadow p-4 border-l-4 border-green-500 h-full flex flex-col justify-center">
                <p className="text-sm text-gray-500">Income</p>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold">$10,500</p>
                  <span className="text-green-600 bg-green-100 text-xs font-medium px-2 py-0.5 rounded">
                    ↑ 11.09%
                  </span>
                </div>
              </div>

              {/* Savings */}
              <div className="bg-white rounded-xl shadow p-4 border-l-4 border-yellow-500 h-full flex flex-col justify-center">
                <p className="text-sm text-gray-500">Savings</p>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold">$5,250</p>
                  <span className="text-green-600 bg-green-100 text-xs font-medium px-2 py-0.5 rounded">
                    ↑ 11.09%
                  </span>
                </div>
              </div>

              {/* Expenses */}
              <div className="bg-white rounded-xl shadow p-4 border-l-4 border-orange-500 h-full flex flex-col justify-center">
                <p className="text-sm text-gray-500">Expenses</p>
                <p className="text-xl font-bold">$3,200</p>
              </div>
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
      />
    </div>
  );
}
