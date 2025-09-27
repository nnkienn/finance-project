"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const expenseData = [
  { name: "Ăn uống", value: 400, color: "#ef4444" }, // red-500
  { name: "Di chuyển", value: 300, color: "#3b82f6" }, // blue-500
  { name: "Other", value: 200, color: "#9ca3af" }, // gray-400
];

export default function RightSidebar() {
  return (
    <div className="col-span-12 md:col-span-3">
      <div className="bg-white rounded-2xl shadow p-6 space-y-6">
        {/* ✅ Summary dọc */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg border-l-4 border-green-500 bg-green-50">
            <p className="text-sm font-medium text-gray-700">Income</p>
            <p className="text-lg font-bold text-green-600">10</p>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border-l-4 border-yellow-500 bg-yellow-50">
            <p className="text-sm font-medium text-gray-700">Savings</p>
            <p className="text-lg font-bold text-yellow-600">5</p>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border-l-4 border-orange-500 bg-orange-50">
            <p className="text-sm font-medium text-gray-700">Expenses</p>
            <p className="text-lg font-bold text-orange-600">3</p>
          </div>
        </div>

        <hr />

        {/* ✅ Expenses by category */}
        <div>
          <h2 className="text-base font-semibold mb-3 text-gray-800">
            Expenses by category
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
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="ml-4 text-sm space-y-2">
              {expenseData.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center text-gray-700"
                >
                  <span
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        <hr />

        {/* ✅ Top categories */}
        <div>
          <h2 className="text-base font-semibold mb-3 text-gray-800">
            Top categories this month
          </h2>
          <ul className="text-sm space-y-2 text-gray-700">
            <li className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
              Ăn uống
            </li>
            <li className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
              Di chuyển
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
