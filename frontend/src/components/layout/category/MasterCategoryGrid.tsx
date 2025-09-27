"use client";
import { MasterCategory } from "@/type/Mastercategory";
import CategoryCard from "./MasterCategoryCard";

export default function CategoryGrid({ categories }: { categories: MasterCategory[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {categories.map((cat) => (
        <CategoryCard key={cat.id} icon={cat.icon} name={cat.name} type={cat.type} />
      ))}
    </div>
  );
}
