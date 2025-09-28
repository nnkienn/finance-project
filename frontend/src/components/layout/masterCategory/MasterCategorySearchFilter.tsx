"use client";

interface Props {
  search: string;
  setSearch: (v: string) => void;
  filter: "ALL" | "EXPENSE" | "INCOME" | "SAVING";
  setFilter: (v: "ALL" | "EXPENSE" | "INCOME" | "SAVING") => void;
}

export default function CategorySearchFilter({
  search,
  setSearch,
  filter,
  setFilter,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between mb-6 gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-full border border-gray-200 bg-gray-50 
            focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
        />
      </div>

      {/* Filter pill */}
      <div className="flex flex-wrap gap-2">
        {["ALL", "EXPENSE", "INCOME", "SAVING"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              filter === f
                ? "bg-pink-500 text-white shadow"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
