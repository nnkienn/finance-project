// src/components/layout/savings/ContributeModal.tsx
"use client";

import React, { useEffect, useState } from "react";

type SavingMini = {
  id: number;
  label?: string;
  target?: number;
  saved?: number;
  color?: string;
};

interface Props {
  saving: SavingMini;
  onClose: () => void;
  /**
   * Called when user submits contribution.
   * Should return a promise if parent needs to await (recommended).
   */
  onSubmit: (amount: number, note?: string, paymentMethod?: string, date?: string) => Promise<void> | void;
}

const payments = ["CASH", "BANK", "CARD"] as const;

export default function ContributeModal({ saving, onClose, onSubmit }: Props) {
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<string>(() => new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("BANK");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // optional: prefill amount or note from saving
    if (saving && saving.saved) {
      // noop for now
    }
  }, [saving]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setAmount(Number.isFinite(v) ? v : 0);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNote(e.target.value);
  };

  const handlePaymentClick = (p: string) => {
    setPaymentMethod(p);
  };

  const handleSubmit = async () => {
    if (!amount || amount <= 0) {
      alert("Amount must be greater than 0");
      return;
    }
    if (!saving?.id) {
      alert("Invalid saving goal");
      return;
    }

    setLoading(true);
    try {
      // delegate creation to parent by calling onSubmit
      await onSubmit(amount, note || `Contribute to ${saving.label ?? "saving"}`, paymentMethod, date);
      onClose();
    } catch (err) {
      console.error("Contribute failed:", err);
      alert("Failed to contribute. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  if (!saving) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Góp tiền: {saving?.label ?? ""}</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Số tiền</label>
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              className="w-full rounded-xl border px-4 py-2 text-right text-sm focus:ring-2 focus:ring-pink-400 outline-none"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Ngày</label>
            <input
              type="date"
              value={date}
              onChange={handleDateChange}
              className="w-full rounded-xl border px-4 py-2 text-sm focus:ring-2 focus:ring-pink-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Ghi chú (tuỳ chọn)</label>
            <input
              type="text"
              value={note}
              onChange={handleNoteChange}
              placeholder="Ví dụ: góp tháng 10"
              className="w-full rounded-xl border px-4 py-2 text-sm focus:ring-2 focus:ring-pink-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Phương thức thanh toán</label>
            <div className="flex gap-2">
              {payments.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handlePaymentClick(p)}
                  className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium border transition
                    ${paymentMethod === p ? "bg-pink-500 text-white border-pink-500" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-xl bg-pink-500 px-4 py-2 text-sm text-white hover:bg-pink-600"
          >
            {loading ? "Processing..." : "Góp tiền"}
          </button>
        </div>
      </div>
    </div>
  );
}
