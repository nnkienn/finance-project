"use client";

import { useState } from "react";
import { UserCategory } from "@/type/UserCategory"; // 👈 type của user category

interface Props {
  categories: UserCategory[]; // 👈 truyền từ Redux xuống
  onApply: (filters: {
    startDate: string | null;
    endDate: string | null;
    type: string | null;       // Income / Expense / Saving
    categoryId: number | null; // 👈 lọc theo user category
  }) => void;
}

export default function TransactionSearchFilter({ categories, onApply }: Props) {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);

  const handleApply = () => {
    const formattedStart = startDate ? `${startDate}T00:00:00` : null;
    const formattedEnd = endDate ? `${endDate}T23:59:59` : null;

    onApply({
      startDate: formattedStart,
      endDate: formattedEnd,
      type,
      categoryId: categoryId ? Number(categoryId) : null,
    });
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

      {/* Transaction type */}
      <div className="flex-1 min-w-[150px]">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Type
        </label>
        <select
          value={type || ""}
          onChange={(e) => setType(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm 
                     focus:outline-none focus:ring-2 focus:ring-pink-400"
        >
          <option value="">All</option>
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
          <option value="SAVING">Saving</option>
        </select>
      </div>

      {/* User category */}
      <div className="flex-1 min-w-[150px]">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          User Category
        </label>
        <select
          value={categoryId || ""}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm 
                     focus:outline-none focus:ring-2 focus:ring-pink-400"
        >
          <option value="">All</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
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
