"use client";

import { UserCategory } from "@/type/UserCategory";

interface Props {
  category: UserCategory;
  onEdit: (c: UserCategory) => void;
  onDelete: (id: number) => void;
}

export default function UserCategoryCard({ category, onEdit, onDelete }: Props) {
  return (
    <div className="border rounded-lg p-4 flex justify-between items-center hover:shadow">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{category.icon}</span>
        <div>
          <p className="font-medium">{category.name}</p>
          <p className="text-xs text-gray-500">Master #{category.masterCategoryId}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(category)}
          className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(category.id)}
          className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
