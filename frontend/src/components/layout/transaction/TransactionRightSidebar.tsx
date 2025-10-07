"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { breakdownService } from "@/service/breakdownService";

const COLORS = [
  "#ef4444", "#3b82f6", "#f97316", "#22c55e", "#a855f7", "#9ca3af",
];

export default function TransactionRightSidebar() {
  const now = new Date();

  // 📊 Category
  const [categoryMonth, setCategoryMonth] = useState(now.getMonth() + 1);
  const [categoryYear, setCategoryYear] = useState(now.getFullYear());
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [highlightCategory, setHighlightCategory] = useState(false);

  // 💳 Payment
  const [paymentMonth, setPaymentMonth] = useState(now.getMonth() + 1);
  const [paymentYear, setPaymentYear] = useState(now.getFullYear());
  const [paymentData, setPaymentData] = useState<any[]>([]);
  const [highlightPayment, setHighlightPayment] = useState(false);

  // ----------- FETCHERS -----------
  const fetchCategory = async (m: number, y: number) => {
    const data = await breakdownService.getCategoryBreakdown(m, y);
    const mapped = Object.entries(data || {}).map(([k, v], i) => ({
      name: k,
      value: Number(v),
      color: COLORS[i % COLORS.length],
    }));
    setCategoryData(mapped);
    triggerHighlight("category");
  };

  const fetchPayment = async (m: number, y: number) => {
    const data = await breakdownService.getPaymentBreakdown(m, y);
    const mapped = Object.entries(data || {}).map(([k, v], i) => ({
      name: k,
      value: Number(v),
      color: COLORS[i % COLORS.length],
    }));
    setPaymentData(mapped);
    triggerHighlight("payment");
  };

  const triggerHighlight = (section: "category" | "payment") => {
    if (section === "category") {
      setHighlightCategory(true);
      setTimeout(() => setHighlightCategory(false), 1000);
    } else {
      setHighlightPayment(true);
      setTimeout(() => setHighlightPayment(false), 1000);
    }
  };

  useEffect(() => {
    fetchCategory(categoryMonth, categoryYear);
    fetchPayment(paymentMonth, paymentYear);
  }, []);

  return (
    <motion.div
      className="col-span-12 md:col-span-3 space-y-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-white rounded-2xl shadow p-6 space-y-8">
        <Section
          title="Category Breakdown"
          data={categoryData}
          month={categoryMonth}
          year={categoryYear}
          highlight={highlightCategory}
          onChangeMonth={(m) => {
            setCategoryMonth(m);
            fetchCategory(m, categoryYear);
          }}
          onChangeYear={(y) => {
            setCategoryYear(y);
            fetchCategory(categoryMonth, y);
          }}
        />

        <hr className="border-gray-200" />

        <Section
          title="Payment Breakdown"
          data={paymentData}
          month={paymentMonth}
          year={paymentYear}
          highlight={highlightPayment}
          onChangeMonth={(m) => {
            setPaymentMonth(m);
            fetchPayment(m, paymentYear);
          }}
          onChangeYear={(y) => {
            setPaymentYear(y);
            fetchPayment(paymentMonth, y);
          }}
        />
      </div>
    </motion.div>
  );
}

// -------------------- SECTION --------------------
function Section({
  title,
  data,
  month,
  year,
  highlight,
  onChangeMonth,
  onChangeYear,
}: {
  title: string;
  data: any[];
  month: number;
  year: number;
  highlight: boolean;
  onChangeMonth: (m: number) => void;
  onChangeYear: (y: number) => void;
}) {
  const years = [2023, 2024, 2025, 2026];
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <motion.div
      animate={
        highlight
          ? {
              scale: 1.02,
              boxShadow: "0 0 15px rgba(37,99,235,0.25)",
              backgroundColor: ["#f0f9ff", "#ffffff"],
            }
          : { scale: 1, boxShadow: "0 0 0 rgba(0,0,0,0)", backgroundColor: "#fff" }
      }
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="rounded-xl p-3 transition"
    >
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
        <div className="flex items-center gap-1">
          <select
            value={month}
            onChange={(e) => onChangeMonth(Number(e.target.value))}
            className="border border-gray-200 rounded px-1.5 py-0.5 text-xs focus:ring-2 focus:ring-blue-500 transition"
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => onChangeYear(Number(e.target.value))}
            className="border border-gray-200 rounded px-1.5 py-0.5 text-xs focus:ring-2 focus:ring-blue-500 transition"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {data.length === 0 ? (
          <motion.p
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs text-gray-400 italic mt-6 text-center"
          >
            Không có dữ liệu cho tháng này.
          </motion.p>
        ) : (
          <motion.div
            key="chart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center"
          >
            <motion.div
              className="w-32 h-32 mb-5"
              animate={
                highlight
                  ? { scale: 1.08, filter: "brightness(1.25)" }
                  : { scale: 1, filter: "brightness(1)" }
              }
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    innerRadius={40}
                    outerRadius={65}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            <div className="w-full space-y-2">
              {data.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center text-gray-700 text-sm px-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="truncate text-[13px] font-medium text-left">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-[13px] font-semibold text-gray-800 tabular-nums">
                    {item.value.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
