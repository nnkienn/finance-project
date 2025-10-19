"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { breakdownService } from "@/service/breakdownService";

const COLORS = ["#ef4444", "#3b82f6", "#f97316", "#22c55e", "#a855f7", "#9ca3af"];

export default function TransactionRightSidebar() {
  const now = new Date();
  const [categoryMonth, setCategoryMonth] = useState(now.getMonth() + 1);
  const [categoryYear, setCategoryYear] = useState(now.getFullYear());
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(true);

  const [paymentMonth, setPaymentMonth] = useState(now.getMonth() + 1);
  const [paymentYear, setPaymentYear] = useState(now.getFullYear());
  const [paymentData, setPaymentData] = useState<any[]>([]);
  const [paymentLoading, setPaymentLoading] = useState(true);

  const fetchCategory = async (m: number, y: number) => {
    setCategoryLoading(true);
    const res = await breakdownService.getCategoryBreakdown(m, y);
    const mapped = Object.entries(res || {}).map(([k, v], i) => ({
      name: k,
      value: Number(v),
      color: COLORS[i % COLORS.length],
    }));
    setTimeout(() => {
      setCategoryData(mapped);
      setCategoryLoading(false);
    }, 250);
  };

  const fetchPayment = async (m: number, y: number) => {
    setPaymentLoading(true);
    const res = await breakdownService.getPaymentBreakdown(m, y);
    const mapped = Object.entries(res || {}).map(([k, v], i) => ({
      name: k,
      value: Number(v),
      color: COLORS[i % COLORS.length],
    }));
    setTimeout(() => {
      setPaymentData(mapped);
      setPaymentLoading(false);
    }, 250);
  };

  useEffect(() => {
    fetchCategory(categoryMonth, categoryYear);
    fetchPayment(paymentMonth, paymentYear);
  }, []);

  return (
    <motion.div
      className="col-span-12 md:col-span-3 space-y-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <SmoothSection
        title="Category Breakdown"
        data={categoryData}
        loading={categoryLoading}
        month={categoryMonth}
        year={categoryYear}
        onChangeMonth={(m) => {
          setCategoryMonth(m);
          fetchCategory(m, categoryYear);
        }}
        onChangeYear={(y) => {
          setCategoryYear(y);
          fetchCategory(categoryMonth, y);
        }}
      />

      <SmoothSection
        title="Payment Breakdown"
        data={paymentData}
        loading={paymentLoading}
        month={paymentMonth}
        year={paymentYear}
        onChangeMonth={(m) => {
          setPaymentMonth(m);
          fetchPayment(m, paymentYear);
        }}
        onChangeYear={(y) => {
          setPaymentYear(y);
          fetchPayment(paymentMonth, y);
        }}
      />
    </motion.div>
  );
}

function SmoothSection({
  title,
  data,
  loading,
  month,
  year,
  onChangeMonth,
  onChangeYear,
}: {
  title: string;
  data: any[];
  loading: boolean;
  month: number;
  year: number;
  onChangeMonth: (m: number) => void;
  onChangeYear: (y: number) => void;
}) {
  const years = [2023, 2024, 2025, 2026];
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <motion.div
      layout
      className="bg-white rounded-2xl shadow p-5 flex flex-col items-center transition-all duration-300 hover-glow"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="flex justify-between items-center w-full mb-4">
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

      {/* Body */}
      <div className="w-full flex flex-col items-center">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              className="flex flex-col items-center justify-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse" />
              <p className="text-sm text-gray-400 mt-2">Đang tải...</p>
            </motion.div>
          ) : data.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-gray-400 italic mt-10"
            >
              Không có dữ liệu cho tháng này.
            </motion.p>
          ) : (
            <motion.div
              key="chart"
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="relative w-[130px] h-[130px] mb-5">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      dataKey="value"
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={2}
                      stroke="#fff"
                      strokeWidth={2}
                    >
                      {data.map((entry, i) => (
                        <Cell key={`cell-${i}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-[12px] text-gray-400">Tổng</p>
                  <p className="text-[14px] font-semibold text-gray-800 tabular-nums">
                    {total.toLocaleString("vi-VN")}₫
                  </p>
                </div>
              </div>

              <div className="w-full space-y-1.5">
                {data.map((item, idx) => (
                  <motion.div
                    key={idx}
                    className="flex justify-between items-center text-gray-700 text-[13px] px-2 py-0.5 rounded-md hover:bg-pink-50/40 transition-colors"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="truncate font-medium">{item.name}</span>
                    </div>
                    <span className="font-semibold text-gray-800 tabular-nums">
                      {item.value.toLocaleString("vi-VN")}đ
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
