"use client";

import Link from "next/link";

type Item = {
  id: number;
  label: string;
  target: number;
  saved: number;
  color: string;
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">My Savings</h2>
      </div>

      <div className="flex flex-col gap-4">
        {items.map((item) => {
          const progress = item.target > 0 ? Math.round((item.saved / item.target) * 100) : 0;
          return (
            <div key={item.id} className="flex items-center justify-between gap-4">
              <Link href={`/savings/${item.id}`} className="flex-1">
                <div className="flex justify-between text-sm text-gray-700">
                  <span className="font-medium">{item.label}</span>
                  <span className="font-semibold text-gray-900">{item.saved}/ {item.target}</span>
                </div>

                <div className="w-full h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
                  <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: item.color }} />
                </div>
              </Link>

              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => onEdit(item)}
                  className="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}

        {items.length === 0 && <p className="text-sm text-gray-400">No saving goals yet.</p>}
      </div>
    </div>
  );
}
