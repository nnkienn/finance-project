"use client";

import { useRouter } from "next/navigation";

interface CategoryCardProps {
  id: number;
  icon?: string;
  name?: string;
  type?: "EXPENSE" | "INCOME" | "SAVING";
}

const badgeStyle: Record<string, string> = {
  EXPENSE: "bg-red-50 text-red-600",
  INCOME: "bg-green-50 text-green-600",
  SAVING: "bg-indigo-50 text-indigo-600",
};

export default function CategoryCard({ id, icon, name, type }: CategoryCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/category/${id}`)}
      className="cursor-pointer border border-gray-200 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition flex flex-col"
    >
      {/* Icon + Title */}
      <div className="flex flex-col items-start space-y-3">
        <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 text-2xl">
          {icon}
        </div>
        <p className="font-medium text-gray-900 text-base">{name}</p>
        {type && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badgeStyle[type]}`}
          >
            {type}
          </span>
        )}
      </div>
    </div>
  );
}
