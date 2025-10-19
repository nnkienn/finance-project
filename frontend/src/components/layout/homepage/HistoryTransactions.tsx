"use client";

import { useEffect, useState } from "react";
import { transactionService } from "@/service/transactionService";
import { Transaction } from "@/type/transaction";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function HistoryTransactions() {
  const [items, setItems] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    transactionService
      .getLatestTransactions(6)
      .then((data) => setTimeout(() => setItems(data), 100))
      .finally(() => setTimeout(() => setLoading(false), 250));
  }, []);

  return (
    <motion.div
      className="bg-white rounded-2xl shadow p-6 flex flex-col h-[390px] overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          History Transactions
        </h2>
        <Link
          href="/transaction"
          className="text-sm font-medium text-pink-500 hover:text-pink-600 transition-colors"
        >
          View all
        </Link>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              className="flex flex-col justify-center items-center mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="w-full h-8 rounded-md bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse mb-2"
                />
              ))}
              <p className="text-sm text-gray-500 mt-2">Đang tải...</p>
            </motion.div>
          ) : items.length === 0 ? (
            <motion.div
              key="empty"
              className="flex flex-col justify-center items-center text-gray-400 h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 mb-2 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l3 3m6 1.5A9 9 0 1 1 3 12a9 9 0 0 1 18 0z"
                />
              </svg>
              <p className="text-sm italic">No recent transactions</p>
            </motion.div>
          ) : (
            <motion.ul
              key="list"
              className="divide-y divide-gray-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {items.map((t, idx) => (
                <motion.li
                  key={t.id || idx}
                  className="flex justify-between items-center py-3 text-sm px-3 rounded-xl transition-all duration-200 hover:bg-pink-50/50 hover-glow cursor-pointer"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.3 }}
                  whileHover={{ scale: 1.01 }}
                >

                  <span className="text-gray-500 font-medium w-[80px] flex-shrink-0">
                    {new Date(t.transactionDate).toLocaleDateString("vi-VN")}
                  </span>
                  <span className="flex-1 text-gray-700 truncate mx-3">
                    {t.note || "Không ghi chú"}
                  </span>
                  <span
                    className={`font-semibold tabular-nums ${Number(t.amount) >= 0
                        ? "text-green-600"
                        : "text-rose-600"
                      }`}
                  >
                    {new Intl.NumberFormat("vi-VN").format(Number(t.amount))}₫
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
