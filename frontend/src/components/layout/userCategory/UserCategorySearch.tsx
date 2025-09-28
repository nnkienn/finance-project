"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface Props {
  search: string;
  setSearch: (v: string) => void;
}

export default function UserCategorySearch({ search, setSearch }: Props) {
  return (
    <div className="mb-6 relative">
      {/* Icon */}
      <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

      {/* Input */}
      <input
        type="text"
        placeholder="Search categories..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-gray-50 
                   focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
      />
    </div>
  );
}
