"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchCategoryBreakdown } from "@/store/slice/transactionSlice";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useAppDispatch } from "@/hook/useAppDispatch";
import { useAppSelector } from "@/hook/useAppSelector";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  defaultMonth: number;
  defaultYear: number;
  title?: string;
};

export default function ExpensesPie({
  defaultMonth,
  defaultYear,
  title = "All Expenses",
}: Props) {
  const dispatch = useAppDispatch();
  const { categoryBreakdown } = useAppSelector((s) => s.transactions);

  const [month, setMonth] = useState(defaultMonth);
  const [year, setYear] = useState(defaultYear);
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    setLocalLoading(true);
    dispatch(fetchCategoryBreakdown({ month, year, type: "EXPENSE" })).finally(
      () => setTimeout(() => setLocalLoading(false), 300)
    );
  }, [dispatch, month, year]);

  const data = useMemo(() => {
    if (!categoryBreakdown || Object.keys(categoryBreakdown).length === 0) {
      return [
        { name: "Tiền điện", value: 250000 },
        { name: "Ăn tối bạn bè", value: 450000 },
        { name: "Tiền thuê trọ", value: 2997500 },
      ];
    }
    return Object.entries(categoryBreakdown).map(([name, value]) => ({
      name,
      value: Number(value),
    }));
  }, [categoryBreakdown]);

  const total = data.reduce((s, d) => s + d.value, 0);
  const COLORS = ["#f472b6", "#ec4899", "#f9a8d4", "#db2777", "#fb7185"];
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = [2023, 2024, 2025, 2026];

  return (
    <motion.div
      className="bg-white rounded-2xl shadow p-6 flex flex-col h-[390px] overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-base font-semibold text-gray-800">{title}</h2>
        <div className="flex items-center gap-1 text-xs text-gray-500 border rounded-lg px-2 py-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3.5 h-3.5 opacity-70"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7H3v12a2 2 0 002 2z"
            />
          </svg>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="bg-transparent outline-none"
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {m.toString().padStart(2, "0")}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="bg-transparent outline-none"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary */}
      <div className="flex flex-row gap-10 mt-1 mb-2 pl-1">
        {[{ label: "Daily", value: total / 30 },
          { label: "Weekly", value: total / 4 },
          { label: "Monthly", value: total }].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <p className="text-xs text-gray-400 mb-0.5">{s.label}</p>
            <p className="font-semibold text-gray-800 tabular-nums text-[15px]">
              {s.value.toLocaleString("vi-VN")}₫
            </p>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <div className="flex-1 flex items-center justify-center pb-1">
        <AnimatePresence mode="wait">
          {localLoading ? (
            <motion.div
              key="loading"
              className="flex flex-col justify-center items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="w-[160px] h-[160px] rounded-full bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse" />
              <p className="text-sm text-gray-500 mt-3">Đang tải...</p>
            </motion.div>
          ) : (
            <motion.div
              key="chart"
              className="flex items-center justify-center gap-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="relative w-[150px] h-[150px] flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={3}
                      stroke="#fff"
                      strokeWidth={2}
                      animationDuration={700}
                      animationBegin={120}
                    >
                      {data.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v: number, name: string) => [
                        `${v.toLocaleString("vi-VN")}₫`,
                        name,
                      ]}
                      contentStyle={{
                        borderRadius: 8,
                        border: "none",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-xs text-gray-400">Tổng</p>
                  <p className="text-[14px] font-bold text-gray-800 tabular-nums">
                    {Math.round(total / 1000).toLocaleString("vi-VN")}K₫
                  </p>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-col gap-2 mt-1">
                {data.map((d, i) => (
                  <div
                    key={i}
                    className="flex items-center text-[13px] text-gray-600 gap-2"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    />
                    {d.name}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
