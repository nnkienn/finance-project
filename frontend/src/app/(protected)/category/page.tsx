"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "@/hook/useAppDispatch";
import { useAppSelector } from "@/hook/useAppSelector";
import NavbarPrivate from "@/components/layout/NavbarPrivate";
import CardInfo from "@/components/layout/dashboard/CardInfo";
import RightSidebar from "@/components/layout/masterCategory/MasterRightSidebar";
import CategorySearchFilter from "@/components/layout/masterCategory/MasterCategorySearchFilter";
import PopularCategories from "@/components/layout/masterCategory/MasterPopularCategories";
import CategoryGrid from "@/components/layout/masterCategory/MasterCategoryGrid";
import { fetchMasterCategories } from "@/store/slice/masterCategorySlice";

export default function CategoryPage() {
  const dispatch = useAppDispatch();
  const { items: categories, loading, error } = useAppSelector(
    (state) => state.masterCategories
  );

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | "EXPENSE" | "INCOME" | "SAVING">("ALL");

  // 🧭 Fetch categories
  useEffect(() => {
    if (filter === "ALL") {
      dispatch(fetchMasterCategories());
    } else {
      dispatch(fetchMasterCategories(filter));
    }
  }, [dispatch, filter]);

  // 🔎 Client-side search filter
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  // 🌟 Popular categories (static highlight)
  const popularCategories = categories.filter((cat) =>
    [
      "Ăn uống",
      "Xăng xe / Di chuyển",
      "Điện nước / Hóa đơn",
      "Lương",
      "Đầu tư",
      "Tiết kiệm dài hạn",
    ].includes(cat.name)
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      <NavbarPrivate />

      <main className="flex-1 pt-24 pb-10 px-4 md:px-8 lg:px-12 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-12 gap-x-5 gap-y-6 items-start">
          {/* LEFT: My Card */}
          <div className="col-span-12 md:col-span-3">
            <h2 className="text-lg font-semibold mb-3">My Card</h2>
            <CardInfo />
          </div>

          {/* CENTER */}
          <div className="col-span-12 md:col-span-9 lg:col-span-6 flex flex-col space-y-6 pt-1">
            {/* Master Categories */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-lg font-semibold mb-5">Master Categories</h2>

              <CategorySearchFilter
                search={search}
                setSearch={setSearch}
                filter={filter}
                setFilter={setFilter}
              />

              {loading && (
                <p className="text-gray-500 text-sm text-center mt-4">Loading...</p>
              )}
              {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}

              {!loading && !error && (
                <div className="space-y-6 mt-4">
                  <PopularCategories categories={popularCategories} />
                  <CategoryGrid categories={filteredCategories} />
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="hidden lg:block lg:col-span-3">
            <RightSidebar />
          </div>
        </div>
      </main>
    </div>
  );
}
