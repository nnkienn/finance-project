"use client";

import { UserCategory } from "@/type/UserCategory";

interface Props {
  categories: UserCategory[];
  onEdit: (c: UserCategory) => void;
  onDelete: (id: number) => void;
}

export default function UserCategoryGrid({ categories, onEdit, onDelete }: Props) {
  if (!categories.length) {
    return <p className="text-gray-500">No categories found.</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {categories.map((cat) => (
        <div
          key={cat.id}
          className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
        >
          {/* Icon + Info */}
          <div className="flex flex-col items-start space-y-3">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 text-2xl">
              {cat.icon}
            </div>
            <p className="font-medium text-gray-900 text-base">{cat.name}</p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => onEdit(cat)}
              className="px-3 py-1.5 text-sm rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(cat.id)}
              className="px-3 py-1.5 text-sm rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
