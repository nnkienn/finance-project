"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const weeklyData = [
  { day: "Mon", income: 60, expense: 40 },
  { day: "Tue", income: 50, expense: 30 },
  { day: "Wed", income: 90, expense: 80 },
  { day: "Thu", income: 70, expense: 20 },
  { day: "Fri", income: 65, expense: 40 },
  { day: "Sat", income: 80, expense: 55 },
  { day: "Sun", income: 55, expense: 35 },
];

const expenseData = [
  { name: "Food", value: 400, color: "#ef4444" },
  { name: "Transport", value: 250, color: "#3b82f6" },
  { name: "Shopping", value: 300, color: "#f97316" },
  { name: "Other", value: 150, color: "#9ca3af" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow rounded-lg px-3 py-2 text-xs">
        <p className="font-medium text-gray-600">{label}</p>
        {payload.map((entry: any, idx: number) => (
          <p
            key={idx}
            className="flex items-center gap-1"
            style={{ color: entry.fill }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.fill }}
            ></span>
            {entry.name}: <span className="font-semibold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function TransactionRightSidebar() {
  return (
    <div className="col-span-12 md:col-span-3">
      <div className="bg-white rounded-2xl shadow p-5 space-y-6">
        {/* ✅ Weekly Overview */}
        <div>
          <h2 className="text-sm font-semibold text-gray-800 mb-3">
            Weekly Overview
          </h2>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} barCategoryGap="30%">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f3f4f6"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "#6b7280", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f9fafb" }} />

                <defs>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#4ade80" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#f87171" stopOpacity={0.6} />
                  </linearGradient>
                </defs>

                <Bar dataKey="income" name="Income" fill="url(#incomeGradient)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expense" name="Expense" fill="url(#expenseGradient)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <hr />

        {/* ✅ Pie Chart: Expense Breakdown */}
        <div>
          <h2 className="text-sm font-semibold text-gray-800 mb-3">
            Expense Breakdown
          </h2>
          <div className="flex items-center">
            <div className="w-28 h-28">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseData}
                    innerRadius={30}
                    outerRadius={55}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="ml-4 text-xs space-y-2">
              {expenseData.map((item, idx) => (
                <div key={idx} className="flex items-center text-gray-700">
                  <span
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  {item.name} -{" "}
                  <span className="font-semibold">{item.value}$</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <hr />

        {/* ✅ Top Transactions */}
        <div>
          <h2 className="text-sm font-semibold text-gray-800 mb-3">
            Top Transactions
          </h2>
          <ul className="text-xs space-y-2">
            <li className="flex justify-between">
              <span className="text-gray-600">Starbucks</span>
              <span className="font-semibold text-red-500">- $25</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Salary</span>
              <span className="font-semibold text-green-500">+ $2,000</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Grab</span>
              <span className="font-semibold text-red-500">- $15</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
