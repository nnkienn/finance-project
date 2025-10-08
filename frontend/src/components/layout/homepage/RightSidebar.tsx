"use client";

import ExpensesPie from "./ExpensesPie";
import HistoryTransactions from "./HistoryTransactions";

type Props = { defaultMonth: number; defaultYear: number };

export default function RightSidebar({ defaultMonth, defaultYear }: Props) {
  return (
    <div className="space-y-6">
      {/* Placeholder MySavings: bạn cắm module goals ở đây */}
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">My Savings</h2>
          <button className="text-pink-500 text-sm font-medium">View all</button>
        </div>
        <p className="text-sm text-gray-500">Coming soon…</p>
      </div>

      <ExpensesPie month={defaultMonth} year={defaultYear} />
      <HistoryTransactions />
    </div>
  );
}
