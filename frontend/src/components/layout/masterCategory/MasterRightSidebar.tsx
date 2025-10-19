"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useAppDispatch } from "@/hook/useAppDispatch";
import { useAppSelector } from "@/hook/useAppSelector";
import {
  fetchCountByType,
  fetchExpensesByCategory,
  fetchTopExpenseCategories,
} from "@/store/slice/userCategorySlice";

const COLORS = [
  "#ef4444", // red
  "#3b82f6", // blue
  "#f97316", // orange
  "#22c55e", // green
  "#a855f7", // purple
  "#9ca3af", // gray
];

export default function RightSidebar() {
  const now = new Date();
  const dispatch = useAppDispatch();

  const { countByType, expensesByCategory, topExpenseCategories, loading } =
    useAppSelector((s) => s.userCategories);

  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [highlight, setHighlight] = useState(false);

  const triggerHighlight = () => {
    setHighlight(true);
    setTimeout(() => setHighlight(false), 800);
  };

  const fetchData = (m: number, y: number) => {
    dispatch(fetchCountByType());
    dispatch(fetchExpensesByCategory({ month: m, year: y }));
    dispatch(fetchTopExpenseCategories({ month: m, year: y, limit: 3 }));
    triggerHighlight();
  };

  useEffect(() => {
    fetchData(month, year);
  }, []);

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = [2023, 2024, 2025, 2026];

  return (
    <motion.div
      className="col-span-12 md:col-span-3"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        animate={
          highlight
            ? {
                scale: 1.02,
                boxShadow: "0 0 15px rgba(37,99,235,0.25)",
                backgroundColor: ["#f0f9ff", "#ffffff"],
              }
            : { scale: 1, backgroundColor: "#fff" }
        }
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow p-6 space-y-6"
      >
        {/* ===================== SUMMARY ===================== */}
        <div>
          <h2 className="text-base font-semibold mb-4 text-gray-800">
            Overview by Type
          </h2>

          {loading ? (
            <SkeletonList count={3} />
          ) : (
            <div className="space-y-4">
              <SummaryCard
                label="Income"
                value={countByType?.INCOME ?? 0}
                color="green"
              />
              <SummaryCard
                label="Savings"
                value={countByType?.SAVING ?? 0}
                color="yellow"
              />
              <SummaryCard
                label="Expenses"
                value={countByType?.EXPENSE ?? 0}
                color="orange"
              />
            </div>
          )}
        </div>

        <hr />

        {/* ===================== EXPENSES BY CATEGORY ===================== */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-base font-semibold text-gray-800">
              Expenses by Category
            </h2>
            <div className="flex items-center gap-1">
              <select
                value={month}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setMonth(val);
                  fetchData(val, year);
                }}
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
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setYear(val);
                  fetchData(month, val);
                }}
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

          {loading ? (
            <SkeletonPie />
          ) : (
            <SectionPie
              data={expensesByCategory}
              highlight={highlight}
            />
          )}
        </div>

        <hr />

        {/* ===================== TOP CATEGORIES ===================== */}
        <div>
          <h2 className="text-base font-semibold mb-3 text-gray-800">
            Top Categories this Month
          </h2>
          {loading ? (
            <SkeletonList count={3} />
          ) : (
            <SectionTop data={topExpenseCategories} />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// -------------------- SMALL COMPONENTS --------------------

function SummaryCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const border = `border-l-4 border-${color}-500`;
  const bg = `bg-${color}-50`;
  const text = `text-${color}-600`;
  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg ${border} ${bg}`}
    >
      <p className="text-sm font-medium text-gray-700">{label}</p>
      <p className={`text-lg font-bold ${text}`}>{value}</p>
    </div>
  );
}

function SectionPie({
  data,
  highlight,
}: {
  data: { name: string; amount: number }[];
  highlight: boolean;
}) {
  const chartData = data.map((d, i) => ({
    name: d.name,
    value: Number(d.amount),
    color: COLORS[i % COLORS.length],
  }));

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="pie"
        animate={
          highlight
            ? { scale: 1.03, filter: "brightness(1.1)" }
            : { scale: 1, filter: "brightness(1)" }
        }
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex items-center"
      >
        {chartData.length === 0 ? (
          <p className="text-xs text-gray-400 italic">No data this month</p>
        ) : (
          <>
            <div className="w-28 h-28">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    innerRadius={30}
                    outerRadius={55}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="ml-4 text-sm space-y-2">
              {chartData.slice(0, 5).map((item, idx) => (
                <div key={idx} className="flex items-center text-gray-700">
                  <span
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  {item.name}
                </div>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

function SectionTop({ data }: { data: { name: string; amount: number }[] }) {
  return (
    <div>
      {data.length === 0 ? (
        <p className="text-xs text-gray-400 italic">No data available</p>
      ) : (
        <ul className="text-sm space-y-2 text-gray-700">
          {data.map((item, idx) => (
            <li key={idx} className="flex items-center">
              <span
                className="w-3 h-3 rounded-full mr-2"
                style={{
                  backgroundColor: COLORS[idx % COLORS.length],
                }}
              ></span>
              {item.name} —{" "}
              <span className="font-semibold ml-1">
                {Number(item.amount).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// -------------------- SKELETONS --------------------

function SkeletonList({ count }: { count: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="h-8 rounded-md bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        ></motion.div>
      ))}
    </div>
  );
}

function SkeletonPie() {
  return (
    <div className="flex items-center justify-center h-32">
      <motion.div
        className="w-16 h-16 rounded-full bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ repeat: Infinity, duration: 1.2 }}
      ></motion.div>
    </div>
  );
}
