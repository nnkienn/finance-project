"use client";

import { useEffect, useMemo } from "react";
import { fetchCategoryBreakdown } from "@/store/slice/transactionSlice";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useAppDispatch } from "@/hook/useAppDispatch";
import { useAppSelector } from "@/hook/useAppSelector";

type Props = {
  month: number;
  year: number;
  title?: string;
};

export default function ExpensesPie({
  month,
  year,
  title = "All Expenses",
}: Props) {
  const dispatch = useAppDispatch();
  const { categoryBreakdown, chartsLoading } = useAppSelector(
    (s) => s.transactions
  );

  useEffect(() => {
    dispatch(fetchCategoryBreakdown({ month, year, type: "EXPENSE" }));
  }, [dispatch, month, year]);

  const data = useMemo(() => {
    if (!categoryBreakdown) return [];
    return Object.entries(categoryBreakdown).map(([name, value], i) => ({
      name,
      value: Number(value),
    }));
  }, [categoryBreakdown]);

  // Tổng chi tiêu
  const total = data.reduce((sum, d) => sum + d.value, 0);

  // Dữ liệu màu hồng pastel
  const COLORS = [
    "#f472b6", // hồng sáng
    "#ec4899", // hồng chính
    "#f9a8d4", // hồng nhạt
    "#be185d", // hồng đậm
  ];

  return (
    <div className="bg-white rounded-2xl shadow p-6 h-[300px] flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>

        <div className="flex items-center gap-1 text-xs text-gray-500 border rounded-lg px-2 py-1">
          <span className="font-medium text-gray-700">6 Month</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3.5 h-3.5 opacity-70"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {chartsLoading ? (
        <p className="text-sm text-gray-500 mt-10 text-center">Loading…</p>
      ) : data.length === 0 ? (
        <p className="text-sm text-gray-400 italic mt-10 text-center">
          Không có dữ liệu cho tháng này.
        </p>
      ) : (
        <div className="flex items-center justify-between flex-1 mt-2">
          {/* Bên trái: số tổng + mô tả */}
          <div className="flex flex-col justify-center gap-3 pl-2">
            <div>
              <p className="text-xs text-gray-400">Daily</p>
              <p className="font-bold text-gray-900">${(total / 30).toFixed(0)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Weekly</p>
              <p className="font-bold text-gray-900">${(total / 4).toFixed(0)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Monthly</p>
              <p className="font-bold text-gray-900">
                ${total.toLocaleString("en-US")}
              </p>
            </div>
          </div>

          {/* Bên phải: donut chart */}
          <div className="w-[140px] h-[140px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={3}
                  stroke="#fff"
                  strokeWidth={3}
                >
                  {data.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: number) => `$${v.toLocaleString("en-US")}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Legend */}
      {data.length > 0 && (
        <div className="flex flex-wrap justify-start gap-4 mt-4">
          {data.map((d, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              {d.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
