"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/hook/useAppDispatch";
import { useAppSelector } from "@/hook/useAppSelector";
import { fetchAllTotals } from "@/store/slice/transactionSlice";

export default function SummaryCards() {
  const dispatch = useAppDispatch();
  const { totalIncome, totalExpense, totalSaving, totalsLoading } = useAppSelector(
    (s) => s.transactions
  );

  useEffect(() => {
    dispatch(fetchAllTotals());
  }, [dispatch]);

  const myBalance = totalIncome - totalExpense - totalSaving;

  const cards = [
    {
      label: "My Balance",
      value: myBalance,
      accent: "border-blue-500",
      extra: "",
    },
    {
      label: "Income",
      value: totalIncome,
      accent: "border-green-500",
      extra: "",
    },
    {
      label: "Savings",
      value: totalSaving,
      accent: "border-yellow-500",
      extra: "",
    },
    {
      label: "Expenses",
      value: totalExpense,
      accent: "border-orange-500",
      extra: "",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
      {cards.map((c) => (
        <div
          key={c.label}
          className={`bg-white rounded-xl shadow p-4 border-l-4 ${c.accent} h-full flex flex-col justify-center`}
        >
          <p className="text-sm text-gray-500">{c.label}</p>
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold">
              {totalsLoading
                ? "…"
                : new Intl.NumberFormat().format(Number(c.value))}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
