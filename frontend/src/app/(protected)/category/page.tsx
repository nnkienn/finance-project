"use client";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/hook/useAppDispatch";
import { useAppSelector } from "@/hook/useAppSelector";
import NavbarPrivate from "@/components/layout/NavbarPrivate";
import CardInfo from "@/components/layout/dashboard/CardInfo";
import RightSidebar from "@/components/layout/category/MasterRightSidebar";
import CategorySearchFilter from "@/components/layout/category/MasterCategorySearchFilter";
import PopularCategories from "@/components/layout/category/MasterPopularCategories";
import CategoryGrid from "@/components/layout/category/MasterCategoryGrid";
import { fetchMasterCategories } from "@/store/slice/masterCategorySlice";

export default function Homepage() {
  const dispatch = useAppDispatch();
  const { items: categories, loading, error } = useAppSelector(
    (state) => state.masterCategories
  );

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | "EXPENSE" | "INCOME" | "SAVING">("ALL");

  // gọi API khi load page
  useEffect(() => {
    if (filter === "ALL") {
      dispatch(fetchMasterCategories());
    } else {
      dispatch(fetchMasterCategories(filter));
    }
  }, [dispatch, filter]);

  // filter client-side thêm theo search
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  const popularCategories = categories.filter((cat) =>
    ["Ăn uống", "Xăng xe / Di chuyển", "Điện nước / Hóa đơn", "Lương", "Đầu tư", "Tiết kiệm dài hạn"].includes(cat.name)
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <NavbarPrivate />
      <main className="pt-24 px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* LEFT */}
          <div className="md:col-span-3">
            <h2 className="text-lg font-semibold mb-4">My Card</h2>
            <CardInfo
              name="Knance"
              number="1234 1234 1234 1234"
              holder="OMI GUSTY"
              expiry="06/24"
              balance={128320}
              up={23.12}
              down={23.12}
              currency="USD / US Dollar"
              status="Active"
            />
          </div>

          {/* CENTER */}
          <div className="md:col-span-6 space-y-6">
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-lg font-semibold mb-6">Master Categories</h2>

              <CategorySearchFilter
                search={search}
                setSearch={setSearch}
                filter={filter}
                setFilter={setFilter}
              />

              {loading && <p className="text-gray-500 text-sm">Loading...</p>}
              {error && <p className="text-red-500 text-sm">{error}</p>}

              {!loading && !error && (
                <>
                  <PopularCategories categories={popularCategories} />
                  <CategoryGrid categories={filteredCategories} />
                </>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="md:col-span-3">
            <RightSidebar />
          </div>
        </div>
      </main>
    </div>
  );
}
