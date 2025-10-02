"use client";

import { useEffect, useState } from "react";
import { Listbox } from "@headlessui/react";
import { Transaction } from "@/type/transaction";
import { TransactionType } from "@/type/TransactionType";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tx: Transaction) => void;
  initialData?: Transaction | null;
}

const categories = ["Food", "Work", "Shopping"];
const payments = ["Cash", "Bank", "Card"];

export default function TransactionModal({ isOpen, onClose, onSave, initialData }: Props) {
  const [form, setForm] = useState<Transaction>({
    id: initialData?.id,
    description: initialData?.description || "",
    amount: initialData?.amount || 0,
    date: initialData?.date || "",
    type: initialData?.type || "EXPENSE",
    category: initialData?.category || "",
    paymentMethod: initialData?.paymentMethod || "",
  });

  useEffect(() => {
    if (initialData) setForm(initialData);
    else
      setForm({
        description: "",
        amount: 0,
        date: "",
        type: "EXPENSE",
        category: "",
        paymentMethod: "",
      });
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (field: keyof Transaction, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md animate-fadeIn">
        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          {form.id ? "Edit Transaction" : "Add Transaction"}
        </h2>

        <div className="space-y-5">
          {/* Description + Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Description & Amount
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="e.g. Starbucks coffee"
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400 outline-none text-sm"
              />
              <input
                type="number"
                value={form.amount}
                onChange={(e) => handleChange("amount", parseFloat(e.target.value))}
                className="w-32 px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400 outline-none text-sm text-right"
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => handleChange("date", e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400 outline-none text-sm"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Type</label>
            <div className="flex justify-between">
              {(["EXPENSE", "INCOME", "SAVING"] as TransactionType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleChange("type", t)}
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

          {/* Category + Payment (Listbox) */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Category & Payment Method
            </label>
            <div className="flex gap-3">
              {/* Category */}
              <Listbox value={form.category} onChange={(val) => handleChange("category", val)}>
                <div className="relative w-full">
                  <Listbox.Button className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-left text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400">
                    {form.category || "Select Category"}
                  </Listbox.Button>
                  <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-sm shadow-lg ring-1 ring-black/10 focus:outline-none z-50">
                    {categories.map((cat, i) => (
                      <Listbox.Option
                        key={i}
                        value={cat}
                        className="cursor-pointer select-none py-2 px-4 hover:bg-pink-50"
                      >
                        {cat}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>

              {/* Payment */}
              <Listbox value={form.paymentMethod} onChange={(val) => handleChange("paymentMethod", val)}>
                <div className="relative w-full">
                  <Listbox.Button className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-left text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400">
                    {form.paymentMethod || "Payment Method"}
                  </Listbox.Button>
                  <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-sm shadow-lg ring-1 ring-black/10 focus:outline-none z-50">
                    {payments.map((pay, i) => (
                      <Listbox.Option
                        key={i}
                        value={pay}
                        className="cursor-pointer select-none py-2 px-4 hover:bg-pink-50"
                      >
                        {pay}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>
          </div>
        </div>

        {/* Actions */}
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
            Save Transaction
          </button>
        </div>
      </div>
    </div>
  );
}
