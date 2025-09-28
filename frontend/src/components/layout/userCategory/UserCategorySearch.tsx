"use client";

interface Props {
  search: string;
  setSearch: (v: string) => void;
}

export default function UserCategorySearch({ search, setSearch }: Props) {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded px-3 py-2"
      />
    </div>
  );
}
