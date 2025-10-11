"use client";

import { useState } from "react";

export default function ContributeModal({
  saving,
  onClose,
  onSubmit,
}: {
  saving: { id: number; label: string; target: number; saved: number; color: string };
  onClose: () => void;
  onSubmit: (amount: number, note?: string) => void;
}) {
  const [amount, setAmount] = useState<number | "">("");
  const [note, setNote] = useState<string>("");

  const handle = () => {
    const v = typeof amount === "number" ? amount : Number(amount);
    if (isNaN(v) || v <= 0) {
      alert("Please enter a valid amount > 0");
      return;
    }
    onSubmit(v, note || undefined);
  };

  return (
    <div className="fixed inset-0 z-70 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-2">Góp tiền cho: {saving.label}</h3>
        <p className="text-sm text-gray-500 mb-4">
          Saved: ${saving.saved} • Target: ${saving.target}
        </p>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 block mb-1">Số tiền</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 outline-none text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">Ghi chú (tùy chọn)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Monthly top-up"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 outline-none text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200">
            Cancel
          </button>
          <button onClick={handle} className="px-4 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600">
            Góp tiền
          </button>
        </div>
      </div>
    </div>
  );
}
