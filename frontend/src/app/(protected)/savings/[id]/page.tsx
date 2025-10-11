// src/app/savings/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import NavbarPrivate from "@/components/layout/NavbarPrivate";
import CardInfo from "@/components/layout/dashboard/CardInfo";
import RightSidebar from "@/components/layout/transaction/TransactionRightSidebar";
import AddSavingModel from "@/components/layout/savings/AddSavingModel";
import ContributeModal from "@/components/layout/savings/ContributeModal";
import TransactionSavingList, { Deposit } from "@/components/layout/savings/TransactionSavingList";

type SavingItem = {
  id: number;
  label: string;
  target: number;
  saved: number;
  color: string;
};

export default function SavingPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id ?? NaN);

  const [saving, setSaving] = useState<SavingItem | null>(null);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [openContribute, setOpenContribute] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  useEffect(() => {
    if (isNaN(id)) return;
    try {
      const rawS = localStorage.getItem("k_savings");
      const rawD = localStorage.getItem("k_deposits");
      const sList: SavingItem[] = rawS ? JSON.parse(rawS) : [];
      const dMap = rawD ? JSON.parse(rawD) : {};
      const found = sList.find((s) => s.id === id) ?? null;
      setSaving(found);
      setDeposits(dMap && dMap[id] ? dMap[id] : []);
    } catch (e) {
      setSaving(null);
      setDeposits([]);
    }
  }, [id]);

  // helper to persist deposits & savings
  const persistDeposits = (newDeposits: Deposit[]) => {
    try {
      const rawD = localStorage.getItem("k_deposits");
      const dMap = rawD ? JSON.parse(rawD) : {};
      dMap[id] = newDeposits;
      localStorage.setItem("k_deposits", JSON.stringify(dMap));
      setDeposits(newDeposits);
    } catch { }
  };

  const persistSavings = (upd: SavingItem) => {
    try {
      const rawS = localStorage.getItem("k_savings");
      const sList: SavingItem[] = rawS ? JSON.parse(rawS) : [];
      const newList = sList.map((s) => (s.id === upd.id ? upd : s));
      localStorage.setItem("k_savings", JSON.stringify(newList));
      setSaving(upd);
    } catch { }
  };

  const handleContribute = (amount: number, note?: string) => {
    if (!saving) return;
    if (amount <= 0) {
      alert("Amount must be > 0");
      return;
    }
    const newDeposit: Deposit = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      savingId: saving.id,
      amount,
      timestamp: new Date().toISOString(),
      note,
    };
    const updated = [newDeposit, ...deposits];
    persistDeposits(updated);

    const updatedSaving: SavingItem = { ...saving, saved: saving.saved + amount };
    persistSavings(updatedSaving);
  };

  const handleEditSave = (payload: any) => {
    if (!saving) return;
    const parsedTarget = Number(payload.targetAmount ?? saving.target);
    const updated: SavingItem = {
      ...saving,
      label: payload.name,
      target: isNaN(parsedTarget) ? saving.target : parsedTarget,
    };
    persistSavings(updated);
    setOpenEdit(false);
  };

  // delete a deposit by id
  const handleDeleteDeposit = (depositId: number) => {
    const updated = deposits.filter((d) => d.id !== depositId);
    persistDeposits(updated);

    if (saving) {
      const removed = deposits.find((d) => d.id === depositId);
      const newSaved = Math.max(0, saving.saved - (removed?.amount ?? 0));
      const updatedSaving = { ...saving, saved: newSaved };
      persistSavings(updatedSaving);
    }
  };

  const progress = saving && saving.target > 0 ? Math.round((saving.saved / saving.target) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <NavbarPrivate />

      <main className="pt-24 px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-12 gap-6">
          {/* LEFT: My Card */}
          <div className="col-span-12 md:col-span-3">
            <h2 className="text-lg font-semibold mb-4 text-pink-600">My Card</h2>
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
            <div className="bg-white rounded-2xl shadow p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-lg font-semibold text-pink-600">Saving Detail</h2>
                  <p className="text-sm text-gray-500">View and manage this saving goal.</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setOpenEdit(true)}
                    className="px-3 py-1.5 bg-pink-50 text-pink-700 border border-pink-100 rounded-lg text-sm hover:shadow-sm transition"
                  >
                    Edit goal
                  </button>
                  <button
                    onClick={() => setOpenContribute(true)}
                    className="px-4 py-1.5 bg-pink-600 text-white rounded-lg text-sm shadow-sm hover:bg-pink-700 transition"
                  >
                    Góp tiền
                  </button>
                </div>
              </div>

              {!saving && <div className="text-sm text-gray-600 mt-3">Không tìm thấy mục tiết kiệm (invalid id) — hãy quay lại trang danh sách.</div>}
            </div>

            {/* --- REPLACE the existing detail card with this block --- */}
            {saving && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                {/* header: title + status aligned top */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-gray-900">{saving.label}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      <span className="font-medium text-gray-900">${saving.saved}</span>
                      <span className="text-gray-400"> &nbsp;/&nbsp; </span>
                      <span className="text-gray-600">${saving.target}</span>
                    </p>
                  </div>

                  {/* status pill - top aligned with title */}
                  <div className="flex-shrink-0 self-start">
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold shadow-sm border
            ${progress >= 100 ? "bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 border-emerald-200" : "bg-white text-pink-700 border-pink-100"}`}
                    >
                      <span
                        className="mr-2 w-2 h-2 rounded-full"
                        style={{
                          background: progress >= 100 ? "#10B981" : "linear-gradient(90deg,#ff7ab6,#ff3e8a)",
                        }}
                      />
                      {progress >= 100 ? "ACHIEVED" : "IN PROGRESS"}
                    </div>
                  </div>
                </div>

                {/* body: progress + description + history */}
                <div className="mt-5">
                  <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                    <div
                      className="h-3 rounded-full transition-all duration-600"
                      style={{
                        width: `${Math.min(progress, 100)}%`,
                        background: `linear-gradient(90deg,#ff7ab6,#ff3e8a)`,
                      }}
                    />
                  </div>

                  <div className="flex justify-between items-center mt-3">
                    <div className="text-xs text-gray-500">{progress}% complete</div>
                    <div className="text-xs font-medium text-gray-700">${saving.saved} / ${saving.target}</div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-sm font-semibold mb-2 text-gray-800">Description</h4>
                    <p className="text-sm text-gray-600">N/A</p>
                  </div>

                  <div className="mt-8">
                    <h4 className="text-sm font-semibold mb-3 text-gray-800">History Transaction</h4>

                    <div className="bg-white rounded-lg p-0 shadow-sm ring-1 ring-gray-50">
                      {/* container with subtle inner padding so table aligns with other cards */}
                      <div className="p-4">
                        <TransactionSavingList deposits={deposits} onDelete={handleDeleteDeposit} />
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>

          {/* RIGHT */}
          <div className="col-span-12 md:col-span-3">
            <RightSidebar />
          </div>
        </div>
      </main>

      {openContribute && saving && (
        <ContributeModal
          saving={saving}
          onClose={() => setOpenContribute(false)}
          onSubmit={(amount, note) => {
            handleContribute(amount, note);
            setOpenContribute(false);
          }}
        />
      )}

      {openEdit && saving && (
        <AddSavingModel
          isOpen={openEdit}
          onClose={() => setOpenEdit(false)}
          onSave={handleEditSave}
          initialData={{
            id: saving.id,
            name: saving.label,
            targetAmount: String(saving.target),
            startDate: null,
            endDate: null,
            description: "",
          }}
        />
      )}
    </div>
  );
}
