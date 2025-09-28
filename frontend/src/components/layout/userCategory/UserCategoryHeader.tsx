"use client";

interface Props {
  masterId: number;
  onNew: () => void;
  onImport: () => void;
}

export default function UserCategoryHeader({ masterId, onNew, onImport }: Props) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-lg font-semibold">User Categories </h2>
     <div className="flex flex-wrap gap-2">
  {/* Import Default */}
  <button
    onClick={onImport}
    className="flex items-center gap-1 px-2.5 py-1 text-xs 
               sm:px-4 sm:py-2 sm:text-sm 
               rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
  >
    <span>📥</span>
    <span className="hidden sm:inline">Import Default</span>
  </button>

  {/* Add New */}
  <button
    onClick={onNew}
    className="flex items-center gap-1 px-2.5 py-1 text-xs 
               sm:px-4 sm:py-2 sm:text-sm 
               rounded-lg bg-pink-500 hover:bg-pink-600 text-white shadow-sm"
  >
    <span>➕</span>
    <span className="hidden sm:inline">New</span>
  </button>
</div>

    </div>
  );
}
