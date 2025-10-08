"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import { motion } from "framer-motion";
import { transactionService } from "@/service/transactionService";

export default function MoneyFlowGradientChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
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
    else startDate.setMonth(now.getMonth() - 0);
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

    setData(mapped);
    setLoading(false);
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow p-6 h-80"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
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

      {loading ? (
        <p className="text-sm text-gray-500 text-center mt-10">Loading chart...</p>
      ) : data.length === 0 ? (
        <p className="text-sm text-gray-400 italic text-center mt-10">
          Không có dữ liệu.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                <stop offset="10%" stopColor="#ec4899" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
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
            />
            <Area
              type="monotone"
              dataKey="net"
              stroke="#ec4899"
              strokeWidth={3}
              fill="url(#colorNet)"
              dot={{ r: 4, fill: "#3b82f6" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
}
