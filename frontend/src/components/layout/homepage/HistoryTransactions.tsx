"use client";

import { useEffect, useState } from "react";
import { transactionService } from "@/service/transactionService";
import { Transaction } from "@/type/transaction";

export default function HistoryTransactions() {
  const [items, setItems] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    transactionService
      .getLatestTransactions(5)
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-800">History Transactions</h2>
        <button className="text-sm font-medium text-pink-500 hover:text-pink-600 transition-colors">
          View all
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-sm text-gray-500 mt-4 text-center">Đang tải...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-500 mt-4 text-center">Chưa có giao dịch.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {items.map((t, idx) => (
            <li
              key={t.id || idx}
              className="flex justify-between items-center py-3 text-sm transition-all duration-200 hover:bg-pink-50/50 hover:scale-[1.01] rounded-lg px-2"
            >
              {/* Ngày giao dịch */}
              <span className="text-gray-500 font-medium w-[80px] flex-shrink-0">
                {new Date(t.transactionDate).toLocaleDateString()}
              </span>

              {/* Ghi chú */}
              <span className="flex-1 text-gray-700 truncate mx-3">
                {t.note || "Không ghi chú"}
              </span>

              {/* Số tiền */}
              <span
                className={`font-semibold tabular-nums ${
                  Number(t.amount) >= 0 ? "text-green-600" : "text-rose-600"
                }`}
              >
                {new Intl.NumberFormat("vi-VN").format(Number(t.amount))}₫
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
