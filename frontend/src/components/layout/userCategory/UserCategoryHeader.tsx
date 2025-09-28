"use client";

interface Props {
  masterId: number;
  onNew: () => void;
  onImport: () => void;
}

export default function UserCategoryHeader({ masterId, onNew, onImport }: Props) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-lg font-semibold">User Categories (Master #{masterId})</h2>
      <div className="flex gap-2">
        <button
          onClick={onImport}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Import Default
        </button>
        <button
          onClick={onNew}
          className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
        >
          + New
        </button>
      </div>
    </div>
  );
}
