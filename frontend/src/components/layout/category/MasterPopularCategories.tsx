"use client";

import { MasterCategory } from "@/type/Mastercategory";

export default function PopularCategories({ categories }: { categories: MasterCategory[] }) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-600 mb-3">Popular</h3>
      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 
              rounded-lg text-sm shadow-sm"
          >
            <span className="text-lg">{cat.icon}</span>
            <span className="font-medium">{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
