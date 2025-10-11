"use client";

import { useEffect, useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: any) => void;
  initialData?: {
    id?: number;
    name?: string;
    targetAmount?: number | string;
    startDate?: string | null;
    endDate?: string | null;
    description?: string | null;
  } | null;
}

export default function AddSavingModel({ isOpen, onClose, onSave, initialData }: Props) {
  const [form, setForm] = useState({
    id: undefined as number | undefined,
    name: "",
    targetAmount: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        id: initialData.id,
        name: initialData.name || "",
        targetAmount:
          initialData.targetAmount !== undefined ? String(initialData.targetAmount) : "",
        startDate: initialData.startDate ? String(initialData.startDate).split("T")[0] : "",
        endDate: initialData.endDate ? String(initialData.endDate).split("T")[0] : "",
        description: initialData.description || "",
      });
    } else {
      setForm({ id: undefined, name: "", targetAmount: "", startDate: "", endDate: "", description: "" });
    }
  }, [initialData]);

  if (!isOpen) return null;

  const validate = () => {
    if (!form.name.trim()) {
      alert("Please enter a name.");
      return false;
    }
    const amt = parseFloat(form.targetAmount as string);
    if (isNaN(amt) || amt < 0.01) {
      alert("Target amount must be a number >= 0.01");
      return false;
    }
    if (form.startDate && form.endDate) {
      if (new Date(form.endDate) < new Date(form.startDate)) {
        alert("End date must be after or equal to start date.");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const payload = {
      id: form.id,
      name: form.name.trim(),
      targetAmount: form.targetAmount,
      startDate: form.startDate || null,
      endDate: form.endDate || null,
      description: form.description || null,
    };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg animate-fadeIn">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          {form.id ? "Edit Saving Goal" : "Create Saving Goal"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
            <input
              type="text"
              placeholder="e.g. Travel to Japan"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400 outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Target Amount</label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="e.g. 1000.00"
              value={form.targetAmount}
              onChange={(e) => setForm({ ...form, targetAmount: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400 outline-none text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Start Date</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">End Date</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400 outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Description (optional)</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400 outline-none text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-xl bg-pink-500 text-white hover:bg-pink-600 transition text-sm font-medium"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
