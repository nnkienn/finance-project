"use client";

import { UserCategory } from "@/type/UserCategory";
import UserCategoryCard from "./UserCategoryCard";

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {categories.map((cat) => (
        <UserCategoryCard
          key={cat.id}
          category={cat}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
