"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Transaction } from "@/type/transaction";
import { motion } from "framer-motion";

interface Props {
  transactions: Transaction[];
  onEdit: (tx: Transaction) => void;
  onDelete: (id: number) => void;
}

export default function TransactionTable({
  transactions,
  onEdit,
  onDelete,
}: Props) {
  const formatAmount = (amount: number, type: string) => (
    <span
      className={`inline-flex items-center justify-end px-2 py-1 rounded-md text-sm font-medium ${
        type === "EXPENSE"
          ? "bg-red-50 text-red-600"
          : type === "INCOME"
          ? "bg-green-50 text-green-600"
          : "bg-yellow-50 text-yellow-600"
      }`}
    >
      {new Intl.NumberFormat("vi-VN").format(amount)}$
    </span>
  );

  return (
    <div className="w-full">
      {/* ✅ Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600 border-collapse">
          <thead className="text-xs text-gray-500 uppercase border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Note</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3 text-center w-[70px]">Action</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((tx, idx) => (
              <motion.tr
                key={tx.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: idx * 0.04,
                  duration: 0.25,
                  ease: "easeOut",
                }}
                className="border-b last:border-0 hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3 whitespace-nowrap text-gray-600">
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
                <td className="px-4 py-3 text-right font-semibold">
                  {formatAmount(tx.amount, tx.type)}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onEdit(tx)}
                      className="text-blue-500 hover:text-blue-700 transition-transform hover:scale-110"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(tx.id!)}
                      className="text-red-500 hover:text-red-700 transition-transform hover:scale-110"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Mobile Card List */}
      <div className="block md:hidden space-y-3">
        {transactions.map((tx, idx) => {
          const amountView = formatAmount(tx.amount, tx.type);
          return (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: idx * 0.05,
                duration: 0.25,
                ease: "easeOut",
              }}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-semibold text-gray-800">
                  {tx.note || "(No note)"}
                </p>
                {amountView}
              </div>

              <div className="flex justify-between text-xs text-gray-500">
                <span>{new Date(tx.transactionDate).toLocaleDateString("vi-VN")}</span>
                <span>{tx.paymentMethod}</span>
              </div>

              <div className="flex justify-between items-center mt-3">
                <span
                  className={`px-2 py-1 rounded-md text-xs font-medium ${
                    tx.type === "EXPENSE"
                      ? "bg-red-50 text-red-600"
                      : tx.type === "INCOME"
                      ? "bg-green-50 text-green-600"
                      : "bg-yellow-50 text-yellow-600"
                  }`}
                >
                  {tx.type}
                </span>

                <div className="flex gap-3">
                  <button
                    onClick={() => onEdit(tx)}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(tx.id!)}
                    className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
