"use client";

import { useState } from "react";

interface Props {
  onApply: (filters: {
    startDate: string | null;
    endDate: string | null;
    category: string | null;
  }) => void;
}

export default function TransactionSearchFilter({ onApply }: Props) {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  const handleApply = () => {
    // format thành LocalDateTime chuẩn ISO
    const formattedStart = startDate ? `${startDate}T00:00:00` : null;
    const formattedEnd = endDate ? `${endDate}T23:59:59` : null;

    onApply({ startDate: formattedStart, endDate: formattedEnd, category });
  };

  return (
    <div className="flex flex-wrap items-end gap-4">
      {/* Start date */}
      <div className="flex-1 min-w-[150px]">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Start date
        </label>
        <input
          type="date"
          value={startDate || ""}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm 
                     focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
      </div>

      {/* End date */}
      <div className="flex-1 min-w-[150px]">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          End date
        </label>
        <input
          type="date"
          value={endDate || ""}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm 
                     focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
      </div>

      {/* Category */}
      <div className="flex-1 min-w-[150px]">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Category
        </label>
        <select
          value={category || ""}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm 
                     focus:outline-none focus:ring-2 focus:ring-pink-400"
        >
          <option value="">All Categories</option>
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
          <option value="SAVING">Saving</option>
        </select>
      </div>

      {/* Apply button */}
      <div>
        <button
          onClick={handleApply}
          className="px-5 py-2 rounded-lg bg-pink-500 text-white text-sm font-medium
                     hover:bg-pink-600 shadow transition"
        >
          Apply filters
        </button>
      </div>
    </div>
  );
}
