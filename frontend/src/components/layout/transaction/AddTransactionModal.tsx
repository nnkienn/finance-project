// src/components/layout/transaction/AddTransactionModal.tsx
"use client";

import { useEffect, useState } from "react";
import { Listbox } from "@headlessui/react";
import { TransactionType } from "@/type/TransactionType";
import { UserCategory } from "@/type/UserCategory";

interface SavingGoal {
  id: number;
  name: string;
  color?: string | null;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: any) => void; // payload chuẩn API
  initialData?: any | null;
  categories: UserCategory[]; // từ redux
  savings?: SavingGoal[]; // list saving goals (từ saving slice)
}

const payments = ["CASH", "BANK", "CARD"];

export default function TransactionModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  categories,
  savings = [],
}: Props) {
  const [form, setForm] = useState({
    note: "",
    amount: 0,
    date: "",
    type: "EXPENSE" as TransactionType,
    userCategoryId: 0,
    paymentMethod: "",
    savingGoalId: 0,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        note: initialData.note ?? "",
        amount: initialData.amount ?? 0,
        date: initialData.transactionDate ? initialData.transactionDate.split("T")[0] : "",
        type: (initialData.type as TransactionType) ?? "EXPENSE",
        userCategoryId: initialData.userCategoryId ?? 0,
        paymentMethod: initialData.paymentMethod ?? "",
        savingGoalId: initialData.savingGoalId ?? 0,
      });
    } else {
      setForm({
        note: "",
        amount: 0,
        date: "",
        type: "EXPENSE",
        userCategoryId: 0,
        paymentMethod: "",
        savingGoalId: 0,
      });
    }
  }, [initialData]);

  useEffect(() => {
    // when switching to SAVING, clear category/payment; when switching away, clear savingGoalId
    if (form.type === "SAVING") {
      if (form.userCategoryId !== 0 || form.paymentMethod !== "") {
        setForm((f) => ({ ...f, userCategoryId: 0, paymentMethod: "" }));
      }
    } else {
      if (form.savingGoalId !== 0) {
        setForm((f) => ({ ...f, savingGoalId: 0 }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.type]);

  if (!isOpen) return null;

  const validateAndBuild = () => {
    if (!form.note.trim()) {
      // optional: you can allow empty note, but keep minimal validation
      // alert("Please enter a note.");
      // return null;
    }
    if (!form.date) {
      alert("⚠️ Please choose a date.");
      return null;
    }
    if (!form.amount || Number.isNaN(form.amount) || Number(form.amount) <= 0) {
      alert("⚠️ Amount must be > 0");
      return null;
    }

    if (form.type === "SAVING") {
      if (!form.savingGoalId) {
        alert("⚠️ Please select a saving goal.");
        return null;
      }
    } else {
      if (!form.userCategoryId) {
        alert("⚠️ Please select a category.");
        return null;
      }
      if (!form.paymentMethod) {
        alert("⚠️ Please select a payment method.");
        return null;
      }
    }

    const payload: any = {
      note: form.note,
      amount: Number(form.amount),
      type: form.type,
      transactionDate: new Date(form.date).toISOString(),
    };

    if (form.type === "SAVING") {
      payload.savingGoalId = Number(form.savingGoalId);
      // optionally include paymentMethod if you want to store it for SAVING:
      if (form.paymentMethod) payload.paymentMethod = form.paymentMethod;
      // userCategoryId purposely not sent for SAVING (DB allows null)
    } else {
      payload.userCategoryId = Number(form.userCategoryId);
      payload.paymentMethod = form.paymentMethod;
    }

    return payload;
  };

  const handleSubmit = () => {
    const payload = validateAndBuild();
    if (!payload) return;
    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md animate-fadeIn">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          {initialData ? "Edit Transaction" : "Add Transaction"}
        </h2>

        <div className="space-y-4">
          {/* Note + Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Note & Amount</label>
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
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value || "0") })}
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
              onChange={(e) => setForm({ ...form, date: e.target.value })}
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
                  onClick={() => setForm({ ...form, type: t })}
                  className={`flex-1 py-2 mx-1 rounded-xl border text-sm font-medium transition 
                    ${form.type === t ? "bg-pink-500 text-white border-pink-500 shadow" : "bg-gray-50 text-gray-600 border-gray-300 hover:bg-gray-100"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* If SAVING -> show SavingGoal selector */}
          {form.type === "SAVING" ? (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Saving Goal</label>
              <div className="flex gap-3">
                <Listbox value={form.savingGoalId} onChange={(val) => setForm({ ...form, savingGoalId: Number(val) })}>
                  <div className="relative w-full">
                    <Listbox.Button className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-left text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400">
                      {form.savingGoalId
                        ? (savings.find((s) => s.id === form.savingGoalId)?.name ?? "Selected")
                        : "Select Saving Goal"}
                    </Listbox.Button>

                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-sm shadow-lg ring-1 ring-black/10 focus:outline-none z-50">
                      {savings.length === 0 && (
                        <div className="py-2 px-4 text-sm text-gray-400">No saving goals found</div>
                      )}
                      {savings.map((sg) => (
                        <Listbox.Option
                          key={sg.id}
                          value={sg.id}
                          className="cursor-pointer select-none py-2 px-4 hover:bg-pink-50 flex items-center gap-3"
                        >
                          <span className="w-8 h-8 rounded-md flex items-center justify-center" style={{ background: sg.color ?? "#f3f4f6" }}>
                            <span className="text-xs font-semibold text-white">{sg.name?.charAt(0) ?? "S"}</span>
                          </span>
                          <div className="truncate">{sg.name}</div>
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </Listbox>
              </div>
            </div>
          ) : (
            // Category + Payment for EXPENSE / INCOME
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Category & Payment Method</label>
              <div className="flex gap-3">
                {/* Category */}
                <Listbox value={form.userCategoryId} onChange={(val) => setForm({ ...form, userCategoryId: Number(val) })}>
                  <div className="relative w-full">
                    <Listbox.Button className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-left text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400">
                      {form.userCategoryId ? (categories.find((c) => c.id === form.userCategoryId)?.name ?? "Selected") : "Select Category"}
                    </Listbox.Button>

                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-sm shadow-lg ring-1 ring-black/10 focus:outline-none z-50">
                      {categories.map((cat) => (
                        <Listbox.Option key={cat.id} value={cat.id} className="cursor-pointer select-none py-2 px-4 hover:bg-pink-50">
                          {cat.name}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </Listbox>

                {/* Payment */}
                <Listbox value={form.paymentMethod} onChange={(val) => setForm({ ...form, paymentMethod: val as string })}>
                  <div className="relative w-full">
                    <Listbox.Button className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-left text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400">
                      {form.paymentMethod || "Payment Method"}
                    </Listbox.Button>

                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-sm shadow-lg ring-1 ring-black/10 focus:outline-none z-50">
                      {payments.map((pay, i) => (
                        <Listbox.Option key={i} value={pay} className="cursor-pointer select-none py-2 px-4 hover:bg-pink-50">
                          {pay}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </Listbox>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition text-sm font-medium">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 rounded-xl bg-pink-500 text-white hover:bg-pink-600 transition text-sm font-medium">
            Save Transaction
          </button>
        </div>
      </div>
    </div>
  );
}
