"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import NavbarPrivate from "@/components/layout/NavbarPrivate";
import CardInfo from "@/components/layout/dashboard/CardInfo";
import RightSidebar from "@/components/layout/transaction/TransactionRightSidebar";
import AddSavingModel from "@/components/layout/savings/AddSavingModel";
import ContributeModal from "@/components/layout/savings/id/ContributeModal";
import TransactionSavingList, { Deposit } from "@/components/layout/savings/id/TransactionSavingList";

import { useAppDispatch } from "@/hook/useAppDispatch";
import { useAppSelector } from "@/hook/useAppSelector";
import { fetchSavingDetail, updateSaving, selectCurrentSaving } from "@/store/slice/savingSlice";
import { createTransaction } from "@/store/slice/transactionSlice";
import api from "@/service/apiService";
import { TransactionPayload } from "@/service/transactionService";
import { TransactionType } from "@/type/TransactionType";
import EditSavingModal from "@/components/layout/savings/EditSavingModal";

type SavingItem = {
  id: number;
  label: string;
  target: number;
  saved: number;
  color: string;
  description?: string | null;
};

export default function SavingPage() {
  const params = useParams();
  const id = Number(params?.id ?? NaN);

  const dispatch = useAppDispatch();
  const currentSaving = useAppSelector(selectCurrentSaving);

  const [saving, setSaving] = useState<SavingItem | null>(null);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [openContribute, setOpenContribute] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  // map BE -> UI
  const mapServerToSaving = (s: any): SavingItem | null => {
    if (!s) return null;
    return {
      id: Number(s.id),
      label: s.name ?? "Untitled",
      target: Number(s.targetAmount ?? 0),
      saved: Number(s.currentAmount ?? 0),
      color: s.color ?? "#ff7ab6",
      description: s.description ?? null,
    };
  };

  // fetch saving detail
  useEffect(() => {
    if (!isNaN(id)) dispatch(fetchSavingDetail(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (currentSaving) setSaving(mapServerToSaving(currentSaving));
  }, [currentSaving]);

  // fetch history
  const loadHistory = async () => {
    if (isNaN(id)) return;
    try {
      const res = await api.get(`/api/saving-goals/${id}/history`);
      const hist = Array.isArray(res.data) ? res.data : [];
      const mapped: Deposit[] = hist.map((h: any) => ({
        id: Number(h.id),
        savingId: id,
        amount: Number(h.amount ?? 0),
        timestamp: h.timestamp ?? h.createdAt ?? new Date().toISOString(),
        note: h.action ?? h.note ?? "",
        payment: "CASH",
      }));
      setDeposits(mapped);
    } catch (e) {
      console.error("Failed to load history:", e);
      setDeposits([]);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [id]);

  // persist saving (update)
  const persistSavings = async (upd: SavingItem) => {
    try {
      const desc = upd.description ?? saving?.description ?? currentSaving?.description ?? null;
      console.log("🟢 persistSavings payload:", { ...upd, description: desc });

      await dispatch(
        updateSaving({
          id: upd.id,
          data: {
            name: upd.label,
            targetAmount: upd.target,
            endDate: null,
            description: desc,
          },
        } as any)
      ).unwrap();

      await dispatch(fetchSavingDetail(upd.id));
      setSaving({ ...upd, description: desc });
    } catch (e) {
      console.error("Failed to persist saving:", e);
    }
  };

  // handle contribute (real transaction)
  const handleContribute = async (amount: number, note?: string) => {
    if (!saving) return;
    if (amount <= 0) {
      alert("Amount must be > 0");
      return;
    }

    try {
      const payload: TransactionPayload = {
        amount,
        type: "SAVING" as TransactionType,
        paymentMethod: "CASH",
        note: note || "Deposit",
        transactionDate: new Date().toISOString(),
        savingGoalId: saving.id,
      };

      await dispatch(createTransaction(payload)).unwrap();

      await dispatch(fetchSavingDetail(saving.id)); // refresh
      await loadHistory(); // refresh history
    } catch (e) {
      console.error("Failed to contribute:", e);
      alert("Deposit failed");
    }
  };

  // handle edit modal
  const handleEditSave = async (payload: any) => {
    if (!saving) return;
    const parsedTarget = Number(payload.targetAmount ?? saving.target);
    const updated: SavingItem = {
      ...saving,
      label: payload.name ?? saving.label,
      target: isNaN(parsedTarget) ? saving.target : parsedTarget,
      description: payload.description ?? saving.description,
    };
    await persistSavings(updated);
    setOpenEdit(false);
  };

  const progress =
    saving && saving.target > 0 ? Math.round((saving.saved / saving.target) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <NavbarPrivate />

      <main className="pt-24 px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-12 gap-6">
          {/* LEFT */}
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
            </div>

            {saving && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-gray-900">{saving.label}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      <span className="font-medium text-gray-900">${saving.saved}</span>
                      <span className="text-gray-400"> &nbsp;/&nbsp; </span>
                      <span className="text-gray-600">${saving.target}</span>
                    </p>
                  </div>

                  <div className="flex-shrink-0 self-start">
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold shadow-sm border
                        ${
                          progress >= 100
                            ? "bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-white text-pink-700 border-pink-100"
                        }`}
                    >
                      <span
                        className="mr-2 w-2 h-2 rounded-full"
                        style={{
                          background:
                            progress >= 100
                              ? "#10B981"
                              : "linear-gradient(90deg,#ff7ab6,#ff3e8a)",
                        }}
                      />
                      {progress >= 100 ? "ACHIEVED" : "IN PROGRESS"}
                    </div>
                  </div>
                </div>

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
                    <div className="text-xs font-medium text-gray-700">
                      ${saving.saved} / ${saving.target}
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-sm font-semibold mb-2 text-gray-800">Description</h4>
                    <p className="text-sm text-gray-600">{saving.description ?? "N/A"}</p>
                  </div>

                  <div className="mt-8">
                    <h4 className="text-sm font-semibold mb-3 text-gray-800">
                      History Transaction
                    </h4>
                    <div className="bg-white rounded-lg p-0 shadow-sm ring-1 ring-gray-50">
                      <div className="p-4">
                        <TransactionSavingList deposits={deposits} onDelete={() => {}} />
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
{openEdit && currentSaving && (
  <EditSavingModal
    isOpen={openEdit}
    onClose={() => setOpenEdit(false)}
    saving={currentSaving}
    onSave={handleEditSave}
  />
)}


    </div>
  );
}
