"use client";

import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { UserCategory } from "@/type/UserCategory";

interface Props {
  categories: UserCategory[]; // 👈 truyền list category vào
  onCreate: (payload: any) => void;
}

export default function AddTransactionModal({ categories, onCreate }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const [form, setForm] = useState({
    note: "",
    amount: "",
    date: "",
    type: "EXPENSE" as "EXPENSE" | "INCOME" | "SAVING",
    userCategoryId: "",
    paymentMethod: "" as "CASH" | "BANK" | "CARD" | "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.userCategoryId) {
      alert("Please select a category");
      return;
    }

    const payload = {
      note: form.note,
      amount: Number(form.amount),
      transactionDate: new Date(form.date).toISOString(),
      type: form.type,
      paymentMethod: form.paymentMethod,
      userCategoryId: Number(form.userCategoryId), // 👈 lấy id từ dropdown
    };

    console.log("API payload:", payload);
    onCreate(payload); // dispatch hoặc API call
    setIsOpen(false);
  };

  return (
    <>
      {/* Nút mở popup */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 rounded-lg bg-pink-500 text-white hover:bg-pink-600 transition"
      >
        + Create Transaction
      </button>

      {/* Modal */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        {/* Overlay */}
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        {/* Content */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-2xl shadow-lg max-w-lg w-full p-6 space-y-6">
            <Dialog.Title className="text-lg font-semibold text-center">
              Add Transaction
            </Dialog.Title>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Note + Amount */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Description"
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  className="border rounded-lg px-3 py-2 text-sm w-full"
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="border rounded-lg px-3 py-2 text-sm w-full"
                />
              </div>

              {/* Date */}
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="border rounded-lg px-3 py-2 text-sm w-full"
              />

              {/* Type */}
              <div className="flex gap-4">
                {["EXPENSE", "INCOME", "SAVING"].map((t) => (
                  <label key={t} className="flex items-center gap-1 text-sm">
                    <input
                      type="radio"
                      checked={form.type === t}
                      onChange={() => setForm({ ...form, type: t as any })}
                    />
                    {t}
                  </label>
                ))}
              </div>

              {/* Category + Payment */}
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={form.userCategoryId}
                  onChange={(e) => setForm({ ...form, userCategoryId: e.target.value })}
                  className="border rounded-lg px-3 py-2 text-sm w-full"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <select
                  value={form.paymentMethod}
                  onChange={(e) => setForm({ ...form, paymentMethod: e.target.value as any })}
                  className="border rounded-lg px-3 py-2 text-sm w-full"
                >
                  <option value="">Payment Method</option>
                  <option value="CASH">Cash</option>
                  <option value="BANK">Bank</option>
                  <option value="CARD">Card</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-pink-500 text-white hover:bg-pink-600"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
