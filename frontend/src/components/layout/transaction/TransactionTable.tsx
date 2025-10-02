"use client";

import { Pencil } from "lucide-react"; // 👈 icon bút chì

interface Transaction {
  id: number;
  amount: number;
  type: "EXPENSE" | "INCOME" | "SAVING";
  paymentMethod: string;
  note: string;
  transactionDate: string;
}

const transactions: Transaction[] = [
  {
    id: 1,
    amount: 8000000,
    type: "EXPENSE",
    paymentMethod: "BANK",
    note: "Lương tháng 9",
    transactionDate: "2025-09-10T09:00:00",
  },
  {
    id: 2,
    amount: 2500000,
    type: "INCOME",
    paymentMethod: "CASH",
    note: "Freelance project",
    transactionDate: "2025-09-12T09:00:00",
  },
];

export default function TransactionTable() {
  const handleEdit = (id: number) => {
    console.log("Edit transaction:", id);
    // mở modal edit hoặc redirect
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-600">
        <thead className="text-xs text-gray-500 uppercase border-b">
          <tr>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Note</th>
            <th className="px-4 py-3">Payment</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3 text-right">Amount</th>
            <th className="px-4 py-3 text-center w-[50px]">Action</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((tx) => (
            <tr
              key={tx.id}
              className="border-b last:border-0 hover:bg-gray-50 transition"
            >
              {/* DATE */}
              <td className="px-4 py-3 whitespace-nowrap">
                {new Date(tx.transactionDate).toLocaleDateString("vi-VN")}
              </td>

              {/* NOTE */}
              <td className="px-4 py-3 truncate">{tx.note}</td>

              {/* PAYMENT */}
              <td className="px-4 py-3">
                <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium">
                  {tx.paymentMethod}
                </span>
              </td>

              {/* TYPE */}
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

              {/* AMOUNT */}
              <td
                className={`px-4 py-3 text-right font-semibold ${
                  tx.type === "EXPENSE" ? "text-red-500" : "text-green-600"
                }`}
              >
                {tx.type === "EXPENSE" ? "-" : "+"}{" "}
                {tx.amount.toLocaleString("vi-VN")}đ
              </td>

              {/* ACTION */}
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => handleEdit(tx.id)}
                  className="p-1 text-blue-500 hover:text-blue-700"
                  title="Edit"
                >
                  <Pencil size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
