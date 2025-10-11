// src/app/savings/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import NavbarPrivate from "@/components/layout/NavbarPrivate";
import CardInfo from "@/components/layout/dashboard/CardInfo";
import RightSidebar from "@/components/layout/transaction/TransactionRightSidebar";
import AddSavingModel from "@/components/layout/savings/AddSavingModel";
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

type SavingItem = {
  id: number;
  label: string;
  target: number; // targetAmount
  saved: number; // current saved amount
  color: string;
};

// helper palette deterministic by id
const PALETTE = ["#ec4899", "#f472b6", "#e879f9", "#db2777", "#f9a8d4", "#fb7185", "#ff7ab6"];
const pickColor = (id: number) => PALETTE[id % PALETTE.length];

export default function Homepage() {
  const dispatch = useAppDispatch();
  const remoteSavings = useAppSelector(selectAllSavings);
  const loading = useAppSelector(selectSavingLoading);

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<any | null>(null);

  // Map backend shape -> UI shape
  const items: SavingItem[] = (remoteSavings || []).map((s: any) => ({
    id: Number(s.id),
    label: String(s.name ?? s.label ?? "Untitled"),
    target: Number(s.targetAmount ?? s.target ?? 0),
    saved: Number(s.currentAmount ?? s.saved ?? 0),
    color: s.color ?? pickColor(Number(s.id ?? 0)),
  }));

  useEffect(() => {
    dispatch(fetchSavings());
  }, [dispatch]);

  const openCreate = () => {
    setEditData(null);
    setShowModal(true);
  };

  const handleEdit = (item: SavingItem) => {
    // prepare initialData for AddSavingModel (fields used earlier)
    setEditData({
      id: item.id,
      name: item.label,
      targetAmount: String(item.target),
      startDate: null,
      endDate: null,
      description: "",
    });
    setShowModal(true);
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

  const handleSave = async (payload: any) => {
    // payload shape from AddSavingModel: { id?, name, targetAmount, startDate, endDate, description }
    const body = {
      name: payload.name,
      targetAmount: Number(payload.targetAmount),
      startDate: payload.startDate || null,
      endDate: payload.endDate || null,
      description: payload.description || null,
    };

    try {
      if (payload.id) {
        // update
        await dispatch(updateSaving({ id: payload.id, data: body })).unwrap();
        alert("✅ Saving updated.");
      } else {
        // create
        await dispatch(createSaving(body)).unwrap();
        alert("✅ Saving created.");
      }
      setShowModal(false);
    } catch (err: any) {
      console.error("Save failed:", err);
      const msg = err?.message || (err?.payload ?? "Unknown error");
      alert("❌ Failed to save: " + msg);
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
            <div className="bg-white rounded-2xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Saving List</h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={openCreate}
                    className="px-4 py-2 bg-pink-500 text-white rounded-lg text-sm font-medium hover:bg-pink-600 transition"
                  >
                    + Create Saving
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-500">Manage your saving goals below.</p>
            </div>

            <div>
              {loading === "loading" && (
                <div className="bg-white rounded-2xl shadow p-6 text-center text-gray-500">Loading savings...</div>
              )}

              <MySavingsList items={items} onEdit={handleEdit} onDelete={handleDelete} />
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-span-12 md:col-span-3">
            <RightSidebar />
          </div>
        </div>
      </main>

      <AddSavingModel isOpen={showModal} onClose={() => setShowModal(false)} onSave={handleSave} initialData={editData} />
    </div>
  );
}
