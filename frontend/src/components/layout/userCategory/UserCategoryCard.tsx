"use client";

import { UserCategory } from "@/type/UserCategory";

interface Props {
  category: UserCategory;
  onEdit: (c: UserCategory) => void;
  onDelete: (id: number) => void;
}

export default function UserCategoryCard({ category, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
      {/* Icon + Name */}
      <div className="flex flex-col items-start space-y-3">
        <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 text-2xl">
          {category.icon}
        </div>
        <p className="font-medium text-gray-900 text-base">{category.name}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onEdit(category)}
          className="flex-1 px-3 py-1.5 text-sm rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(category.id)}
          className="flex-1 px-3 py-1.5 text-sm rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
