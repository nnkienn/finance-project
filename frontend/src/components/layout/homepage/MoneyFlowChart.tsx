"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { transactionService } from "@/service/transactionService";

export default function MoneyFlowGradientChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"1M" | "3M" | "6M">("6M");

  useEffect(() => {
    fetchData(period);
  }, [period]);

  const fetchData = async (p: "1M" | "3M" | "6M") => {
    setLoading(true);
    const now = new Date();
    const end = now.toISOString().split("T")[0];
    const startDate = new Date();

    if (p === "6M") startDate.setMonth(now.getMonth() - 5);
    else if (p === "3M") startDate.setMonth(now.getMonth() - 2);
    else startDate.setMonth(now.getMonth());

    const start = startDate.toISOString().split("T")[0];
    const res = await transactionService.getTimeseries({
      from: start,
      to: end,
      granularity: "MONTHLY",
      scope: "ALL",
    });

    const mapped = (res.points || []).map((d: any) => ({
      date: d.date,
      net: Number(d.net),
    }));

    // ✅ Delay nhỏ giúp tránh jump frame
    setTimeout(() => {
      setData(mapped);
      setLoading(false);
    }, 350);
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-md p-6 h-[400px] flex flex-col justify-between overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Money Flow</h2>
        <div className="flex gap-2 text-xs">
          {["1M", "3M", "6M"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p as any)}
              className={`px-2 py-1 rounded-lg border text-gray-600 hover:bg-blue-50 transition ${
                period === p
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-gray-200"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Chart container */}
      <div className="relative flex-1 min-h-[300px]">
        <AnimatePresence mode="wait">
          {loading ? (
            // 🩶 Skeleton shimmer
            <motion.div
              key="skeleton"
              className="absolute inset-0 flex flex-col justify-center items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-full h-64 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-xl animate-pulse" />
              <p className="text-sm text-gray-500 mt-3">Loading chart...</p>
            </motion.div>
          ) : data.length === 0 ? (
            // 🕳 No data
            <motion.p
              key="empty"
              className="text-sm text-gray-400 italic text-center mt-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Không có dữ liệu.
            </motion.p>
          ) : (
            // 🎨 Smooth chart
            <motion.div
              key="chart"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="10%" stopColor="#ec4899" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f3f4f6"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(val: number) => `$${val.toLocaleString()}`}
                    cursor={{ stroke: "#ec4899", strokeWidth: 1 }}
                    contentStyle={{
                      borderRadius: 8,
                      border: "none",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="net"
                    stroke="#ec4899"
                    strokeWidth={3}
                    fill="url(#colorNet)"
                    dot={{ r: 4, fill: "#ec4899" }}
                    isAnimationActive={true}
                    animationDuration={800}
                    animationBegin={100}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
