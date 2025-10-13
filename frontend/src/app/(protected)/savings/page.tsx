"use client";

import { useEffect, useState } from "react";
import NavbarPrivate from "@/components/layout/NavbarPrivate";
import CardInfo from "@/components/layout/dashboard/CardInfo";
import RightSidebar from "@/components/layout/transaction/TransactionRightSidebar";
import AddSavingModel from "@/components/layout/savings/AddSavingModel";
import EditSavingModal from "@/components/layout/savings/EditSavingModal";
import MySavingsList from "@/components/layout/savings/MySavingsList";

import { useAppDispatch } from "@/hook/useAppDispatch";
import { useAppSelector } from "@/hook/useAppSelector";
import {
  fetchSavings,
  createSaving,
  updateSaving,
  deleteSaving,
  selectAllSavings,
  selectSavingLoading,
} from "@/store/slice/savingSlice";
import { SavingGoalResponse } from "@/service/savingService";

// =======================
// UI Type
// =======================
type SavingItem = {
  id: number;
  label: string;
  target: number;
  saved: number;
  color: string;
  startDate?: string | null;
  endDate?: string | null;
  description?: string | null;
};

// helper palette
const PALETTE = ["#ec4899", "#f472b6", "#e879f9", "#db2777", "#f9a8d4", "#fb7185", "#ff7ab6"];
const pickColor = (id: number) => PALETTE[id % PALETTE.length];

export default function SavingsPage() {
  const dispatch = useAppDispatch();
  const remoteSavings = useAppSelector(selectAllSavings);
  const loading = useAppSelector(selectSavingLoading);

  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<SavingGoalResponse | null>(null);

  useEffect(() => {
    dispatch(fetchSavings());
  }, [dispatch]);

  // map backend shape -> UI shape
  const items: SavingItem[] = (remoteSavings || []).map((s: any) => ({
    id: Number(s.id),
    label: s.name ?? "Untitled",
    target: Number(s.targetAmount ?? 0),
    saved: Number(s.currentAmount ?? 0),
    color: s.color ?? pickColor(Number(s.id ?? 0)),
    startDate: s.startDate ?? null,
    endDate: s.endDate ?? null,
    description: s.description ?? null,
  }));

  const openCreate = () => {
    setEditing(null);
    setShowCreate(true);
  };

  const handleEdit = (item: SavingItem) => {
    const found = remoteSavings.find((s) => s.id === item.id);
    if (found) setEditing(found);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this saving goal?")) return;
    try {
      await dispatch(deleteSaving(id)).unwrap();
      alert("✅ Deleted.");
    } catch (err: any) {
      console.error("Delete saving failed:", err);
      alert("❌ Delete failed: " + (err?.message ?? "Unknown"));
    }
  };

  const handleSaveCreate = async (payload: any) => {
    const body = {
      name: payload.name,
      targetAmount: Number(payload.targetAmount),
      startDate: payload.startDate || null,
      endDate: payload.endDate || null,
      description: payload.description || null,
    };
    try {
      await dispatch(createSaving(body)).unwrap();
      alert("✅ Saving created.");
      setShowCreate(false);
    } catch (err: any) {
      console.error("Create failed:", err);
      alert("❌ Failed: " + (err?.message ?? "Unknown"));
    }
  };

  const handleSaveEdit = async (data: any) => {
    const body = {
      name: data.name,
      targetAmount: Number(data.targetAmount),
      startDate: data.startDate ?? editing?.startDate ?? null,
      endDate: data.endDate ?? editing?.endDate ?? null,
      description: data.description ?? editing?.description ?? null,
    };
    try {
      await dispatch(updateSaving({ id: data.id, data: body })).unwrap();
      alert("✅ Saving updated.");
      setEditing(null);
    } catch (err: any) {
      console.error("Update failed:", err);
      alert("❌ Failed: " + (err?.message ?? "Unknown"));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <NavbarPrivate />

      <main className="pt-24 px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-12 gap-6">
          {/* LEFT */}
          <div className="col-span-12 md:col-span-3">
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
          <div className="col-span-12 md:col-span-6 space-y-6">
            <div className="bg-white rounded-2xl shadow p-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Saving Goals</h2>
                <p className="text-sm text-gray-500">Manage your saving goals.</p>
              </div>
              <button
                onClick={openCreate}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg text-sm font-medium hover:bg-pink-600 transition"
              >
                + Create
              </button>
            </div>

            {loading === "loading" ? (
              <div className="bg-white rounded-2xl shadow p-6 text-center text-gray-500">Loading savings...</div>
            ) : (
              <MySavingsList items={items} onEdit={handleEdit} onDelete={handleDelete} />
            )}
          </div>

          {/* RIGHT */}
          <div className="col-span-12 md:col-span-3">
            <RightSidebar />
          </div>
        </div>
      </main>

      {/* --- MODALS --- */}
      {showCreate && (
        <AddSavingModel
          isOpen={showCreate}
          onClose={() => setShowCreate(false)}
          onSave={handleSaveCreate}
          initialData={null}
        />
      )}

      {editing && (
        <EditSavingModal
          isOpen={!!editing}
          onClose={() => setEditing(null)}
          saving={editing}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}
