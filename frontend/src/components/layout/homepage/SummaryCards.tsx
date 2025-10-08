"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "@/hook/useAppDispatch";
import { useAppSelector } from "@/hook/useAppSelector";
import { fetchMonthlyCards } from "@/store/slice/transactionSlice";

type Props = { defaultMonth: number; defaultYear: number };

export default function SummaryCards({ defaultMonth, defaultYear }: Props) {
  const dispatch = useAppDispatch();
  const { cards, cardsLoading } = useAppSelector((s) => s.transactions);
  const [month, setMonth] = useState(defaultMonth);
  const [year, setYear] = useState(defaultYear);

  useEffect(() => {
    dispatch(fetchMonthlyCards({ month, year }));
  }, [dispatch, month, year]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
      {[
        {
          label: "My Balance",
          value: cards?.myBalance ?? 0,
          accent: "border-blue-500",
          extra: null,
        },
        {
          label: "Income",
          value: cards?.income ?? 0,
          accent: "border-green-500",
          extra: cards ? `↑ ${cards.incomePct}%` : "",
        },
        {
          label: "Savings",
          value: cards?.savings ?? 0,
          accent: "border-yellow-500",
          extra: cards ? `↑ ${cards.savingsPct}%` : "",
        },
        {
          label: "Expenses",
          value: cards?.expenses ?? 0,
          accent: "border-orange-500",
          extra: cards ? `↑ ${cards.expensesPct}%` : "",
        },
      ].map((c) => (
        <div
          key={c.label}
          className={`bg-white rounded-xl shadow p-4 border-l-4 ${c.accent} h-full flex flex-col justify-center`}
        >
          <p className="text-sm text-gray-500">{c.label}</p>
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold">
              {cardsLoading ? "…" : new Intl.NumberFormat().format(Number(c.value))}
            </p>
            {!!c.extra && (
              <span className="text-green-600 bg-green-100 text-xs font-medium px-2 py-0.5 rounded">
                {c.extra}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
