"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import NavbarPrivate from "@/components/layout/NavbarPrivate";
import CardInfo from "@/components/layout/dashboard/CardInfo";
import RightSidebar from "@/components/layout/transaction/TransactionRightSidebar";
import AddSavingModel from "@/components/layout/savings/AddSavingModel";
import MySavingsList from "@/components/layout/savings/MySavingsList";

type SavingItem = {
  id: number;
  label: string;
  target: number; // targetAmount
  saved: number; // current saved amount
  color: string;
};

type Deposit = {
  id: number;
  savingId: number;
  amount: number;
  timestamp: string; // ISO
  note?: string;
};

const RAW_INITIAL = [
  { id: 1, label: "Gaming PC", amount: 309, color: "#ec4899", progress: 30 },
  { id: 2, label: "New house", amount: 950, color: "#f472b6", progress: 70 },
  { id: 3, label: "Summer trip", amount: 550, color: "#e879f9", progress: 50 },
  { id: 4, label: "Wedding", amount: 620, color: "#db2777", progress: 60 },
  { id: 5, label: "Top up game", amount: 170, color: "#f9a8d4", progress: 20 },
];

function buildInitial(): { savings: SavingItem[]; deposits: Record<number, Deposit[]> } {
  const savings = RAW_INITIAL.map((r) => {
    const target = r.amount;
    const saved = Math.round((r.progress / 100) * target);
    return { id: r.id, label: r.label, target, saved, color: r.color };
  });
  const deposits: Record<number, Deposit[]> = {};
  savings.forEach((s) => {
    deposits[s.id] = s.saved > 0 ? [
      {
        id: Date.now() + s.id,
        savingId: s.id,
        amount: s.saved,
        timestamp: new Date().toISOString(),
        note: "Initial mock deposit",
      },
    ] : [];
  });
  return { savings, deposits };
}

export default function Homepage() {
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<any | null>(null);
  const [savings, setSavings] = useState<SavingItem[]>([]);
  const [deposits, setDeposits] = useState<Record<number, Deposit[]>>({});

useEffect(() => {
  try {
    const rawS = localStorage.getItem("k_savings");
    const rawD = localStorage.getItem("k_deposits");
    const parsedS = rawS ? JSON.parse(rawS) : null;
    const parsedD = rawD ? JSON.parse(rawD) : null;

    // nếu localStorage có mảng hợp lệ và có ít nhất 1 phần tử -> dùng nó
    if (Array.isArray(parsedS) && parsedS.length > 0 && parsedD && Object.keys(parsedD).length > 0) {
      setSavings(parsedS);
      setDeposits(parsedD);
    } else {
      const all = buildInitial();
      setSavings(all.savings);
      setDeposits(all.deposits);
      localStorage.setItem("k_savings", JSON.stringify(all.savings));
      localStorage.setItem("k_deposits", JSON.stringify(all.deposits));
    }
  } catch (e) {
    const all = buildInitial();
    setSavings(all.savings);
    setDeposits(all.deposits);
  }
}, []);

  // persist on change
  useEffect(() => {
    try {
      localStorage.setItem("k_savings", JSON.stringify(savings));
    } catch {}
  }, [savings]);

  useEffect(() => {
    try {
      localStorage.setItem("k_deposits", JSON.stringify(deposits));
    } catch {}
  }, [deposits]);

  const openCreate = () => {
    setEditData(null);
    setShowModal(true);
  };

  const handleEdit = (item: SavingItem) => {
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

  const handleDelete = (id: number) => {
    if (!confirm("Delete this saving goal?")) return;
    setSavings((prev) => prev.filter((s) => s.id !== id));
    setDeposits((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const handleSave = (payload: any) => {
    const parsedTarget = Number(payload.targetAmount ?? 0);
    if (payload.id) {
      setSavings((prev) =>
        prev.map((s) =>
          s.id === payload.id ? { ...s, label: payload.name, target: isNaN(parsedTarget) ? s.target : parsedTarget } : s
        )
      );
    } else {
      const nextId = savings.length ? Math.max(...savings.map((s) => s.id)) + 1 : 1;
      const palette = ["#ec4899", "#f472b6", "#e879f9", "#db2777", "#f9a8d4", "#fb7185"];
      const color = palette[Math.floor(Math.random() * palette.length)];
      setSavings((prev) => [
        ...prev,
        { id: nextId, label: payload.name, target: isNaN(parsedTarget) ? 0 : parsedTarget, saved: 0, color },
      ]);
      setDeposits((prev) => ({ ...prev, [nextId]: [] }));
    }
    setShowModal(false);
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

            <MySavingsList
              items={savings}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
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
