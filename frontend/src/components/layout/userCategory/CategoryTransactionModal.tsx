"use client";

import { Dialog } from "@headlessui/react";
import { useState, useEffect } from "react";
import { UserCategory } from "@/type/UserCategory";
import { Transaction } from "@/type/transaction";

interface Props {
  open: boolean;
  category: UserCategory | null;
  onClose: () => void;
  onCreate: (payload: Omit<Transaction, "id">) => void; 
  // 👆 truyền đúng type API (không cần id khi tạo mới)
}

export default function CategoryTransactionModal({
  open,
  category,
  onClose,
  onCreate,
}: Props) {
  const [form, setForm] = useState({
    note: "",
    amount: "",
    date: "",
    type: "EXPENSE" as "EXPENSE" | "INCOME" | "SAVING",
    paymentMethod: "" as "CASH" | "BANK" | "CARD" | "",
  });

  // Reset form khi đổi category
  useEffect(() => {
    if (category) {
      setForm({
        note: "",
        amount: "",
        date: "",
        type: "EXPENSE",
        paymentMethod: "",
      });
    }
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;

    const payload: Omit<Transaction, "id"> = {
      note: form.note,
      amount: Number(form.amount),
      transactionDate: new Date(form.date).toISOString(),
      type: form.type,
      paymentMethod: form.paymentMethod as "CASH" | "BANK" | "CARD",
      userCategoryId: category.id, // 👈 ID của category
    };

    console.log("Create transaction payload:", payload);
    onCreate(payload);
    onClose();
  };

  if (!open || !category) return null;

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40 transition-opacity" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-fadeIn">
          <Dialog.Title className="text-xl font-semibold text-gray-800 mb-6 text-center">
            Add Transaction in {category.name}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Note + Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Note & Amount
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="e.g. Starbucks coffee"
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400 outline-none text-sm"
                />
                <input
                  type="number"
                  placeholder="0"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-32 px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400 outline-none text-sm text-right"
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400 outline-none text-sm"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Type
              </label>
              <div className="flex justify-between">
                {["EXPENSE", "INCOME", "SAVING"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm({ ...form, type: t as any })}
                    className={`flex-1 py-2 mx-1 rounded-xl border text-sm font-medium transition 
                      ${form.type === t
                        ? "bg-pink-500 text-white border-pink-500 shadow"
                        : "bg-gray-50 text-gray-600 border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Payment Method
              </label>
              <select
                value={form.paymentMethod}
                onChange={(e) =>
                  setForm({ ...form, paymentMethod: e.target.value as any })
                }
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400 outline-none text-sm"
              >
                <option value="">Payment Method</option>
                <option value="CASH">Cash</option>
                <option value="BANK">Bank</option>
                <option value="CARD">Card</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-pink-500 text-white hover:bg-pink-600 transition text-sm font-medium"
              >
                Save Transaction
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
