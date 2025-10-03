"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/hook/useAppDispatch";
import { useAppSelector } from "@/hook/useAppSelector";
import NavbarPrivate from "@/components/layout/NavbarPrivate";
import CardInfo from "@/components/layout/dashboard/CardInfo";
import RightSidebar from "@/components/layout/masterCategory/MasterRightSidebar";
import {
  fetchUserCategoriesByMaster,
  addUserCategory,
  editUserCategory,
  removeUserCategory,
  importDefaultUserCategory,
} from "@/store/slice/userCategorySlice";
import { UserCategory } from "@/type/UserCategory";
import { Transaction } from "@/type/transaction";

import UserCategoryHeader from "@/components/layout/userCategory/UserCategoryHeader";
import UserCategorySearch from "@/components/layout/userCategory/UserCategorySearch";
import UserCategoryGrid from "@/components/layout/userCategory/UserCategoryGrid";
import UserCategoryModal from "@/components/layout/userCategory/UserCategoryModal";
import CategoryTransactionModal from "@/components/layout/userCategory/CategoryTransactionModal"; // 👈 modal add transaction từ category

export default function UserCategoryPage() {
  const { masterId } = useParams();
  const dispatch = useAppDispatch();
  const { items: categories, loading, error } = useAppSelector(
    (state) => state.userCategories
  );

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<UserCategory | null>(null);

  const [formName, setFormName] = useState("");
  const [formIcon, setFormIcon] = useState("");

  // 👇 state cho transaction modal
  const [selectedCategory, setSelectedCategory] = useState<UserCategory | null>(null);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);

  // Load categories by masterId
  useEffect(() => {
    if (masterId) {
      dispatch(fetchUserCategoriesByMaster(Number(masterId)));
    }
  }, [dispatch, masterId]);

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // Open Category modal
  const handleOpenModal = (cate?: UserCategory) => {
    if (cate) {
      setEditing(cate);
      setFormName(cate.name);
      setFormIcon(cate.icon || "");
    } else {
      setEditing(null);
      setFormName("");
      setFormIcon("");
    }
    setIsModalOpen(true);
  };

  // Submit Category form
  const handleSubmit = async () => {
    if (!formName.trim()) return alert("Name is required");
    if (editing) {
      await dispatch(
        editUserCategory({
          id: editing.id,
          data: { name: formName, icon: formIcon, masterCategoryId: Number(masterId) },
        })
      ).unwrap();
    } else {
      await dispatch(
        addUserCategory({
          name: formName,
          icon: formIcon,
          masterCategoryId: Number(masterId),
        })
      ).unwrap();
    }
    setIsModalOpen(false);
  };

  // Delete Category
  const handleDelete = async (id: number) => {
    if (confirm("Delete this category?")) {
      await dispatch(removeUserCategory(id)).unwrap();
    }
  };

  // Import default
  const handleImportDefault = async () => {
    await dispatch(importDefaultUserCategory()).unwrap();
  };

  // 👇 Add transaction từ category
  const handleAddTransaction = (cat: UserCategory) => {
    setSelectedCategory(cat);
    setIsTxModalOpen(true);
  };

  // 👇 Lưu transaction mock (sau này connect Redux)
  const handleCreateTransaction = (tx: Transaction) => {
    console.log("New Transaction created:", tx);
    // TODO: dispatch(addTransaction(tx))
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <NavbarPrivate />
      <main className="pt-24 px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* LEFT */}
          <div className="md:col-span-3">
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
              <UserCategoryHeader
                masterId={Number(masterId)}
                onNew={() => handleOpenModal()}
                onImport={handleImportDefault}
              />

              <UserCategorySearch search={search} setSearch={setSearch} />

              {loading && <p className="text-gray-500">Loading...</p>}
              {error && <p className="text-red-500">{error}</p>}

              <UserCategoryGrid
                categories={filteredCategories}
                onEdit={handleOpenModal}
                onDelete={handleDelete}
                onAddTransaction={handleAddTransaction} // 👈 thêm props mới
              />
            </div>
          </div>

          {/* RIGHT */}
          <div className="md:col-span-3">
            <RightSidebar />
          </div>
        </div>
      </main>

      {/* Category Modal */}
      <UserCategoryModal
        open={isModalOpen}
        editing={editing}
        formName={formName}
        formIcon={formIcon}
        setFormName={setFormName}
        setFormIcon={setFormIcon}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />

      {/* Transaction Modal */}
      <CategoryTransactionModal
        open={isTxModalOpen}
        category={selectedCategory}
        onClose={() => setIsTxModalOpen(false)}
        onCreate={handleCreateTransaction}
      />
    </div>
  );
}
