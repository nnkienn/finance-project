"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";

type Item = {
  id: number;
  label: string;
  target: number;
  saved: number;
  color: string;
  progress?: number;
};

export default function MySavingsList({
  items,
  onEdit,
  onDelete,
}: {
  items: Item[];
  onEdit: (item: Item) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold text-gray-800">My Savings</h2>
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-4">
          No saving goals yet.
        </p>
      )}

      {/* List */}
      <div className="flex flex-col gap-4">
        {items.map((item) => {
          const progress =
            item.progress ??
            (item.target > 0 ? Math.round((item.saved / item.target) * 100) : 0);

          return (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl border border-gray-100 hover:shadow-sm transition bg-white"
            >
              {/* Left — Info */}
              <Link
                href={`/savings/${item.id}`}
                className="flex-1 w-full group"
              >
                <div className="flex justify-between text-sm text-gray-700">
                  <span className="font-medium group-hover:text-pink-600 transition">
                    {item.label}
                  </span>
                  <span className="font-semibold text-gray-900">
                    {item.saved.toLocaleString()} /{" "}
                    {item.target.toLocaleString()}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  {progress.toFixed(1)}% completed
                </p>
              </Link>

              {/* Right — Actions */}
              <div className="flex items-center justify-end gap-2 sm:gap-3">
                <button
                  onClick={() => onEdit(item)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition"
                >
                  <Pencil size={14} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
