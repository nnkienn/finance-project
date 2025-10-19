"use client";

import { useEffect } from "react";
import { PiggyBank, Target, Rocket, Award } from "lucide-react";
import { useAppDispatch } from "@/hook/useAppDispatch";
import { useAppSelector } from "@/hook/useAppSelector";
import {
  fetchSavingSummary,
  selectSavingSummary,
  selectSavingAnalyticsLoading,
} from "@/store/slice/savingAnalyticsSlice";

export default function SavingSummaryGrid() {
  const dispatch = useAppDispatch();
  const summary = useAppSelector(selectSavingSummary);
  const loading = useAppSelector(selectSavingAnalyticsLoading);

  // Gọi API khi mount nếu chưa có data
  useEffect(() => {
    if (!summary) dispatch(fetchSavingSummary());
  }, [dispatch, summary]);

  const cards = [
    {
      title: "Total Saved",
      value: summary ? `$${summary.totalSaved.toLocaleString()}` : "--",
      change: "+15.46%",
      accent: "from-pink-400 to-pink-600",
      icon: <PiggyBank className="text-pink-500 w-5 h-5" />,
    },
    {
      title: "Total Goals",
      value: summary ? summary.totalGoals.toString() : "--",
      change: "+5%",
      accent: "from-purple-400 to-purple-600",
      icon: <Target className="text-purple-500 w-5 h-5" />,
    },
    {
      title: "Active Goals",
      value: summary ? summary.active.toString() : "--",
      change: "+10%",
      accent: "from-blue-400 to-blue-600",
      icon: <Rocket className="text-blue-500 w-5 h-5" />,
    },
    {
      title: "Achieved Goals",
      value: summary ? summary.achieved.toString() : "--",
      change: "+8%",
      accent: "from-emerald-400 to-emerald-600",
      icon: <Award className="text-emerald-500 w-5 h-5" />,
    },
  ];

  if (loading === "loading") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-24 bg-gray-100 rounded-2xl shadow-sm border border-gray-200"
          ></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => (
        <div
          key={i}
          className={`
            relative bg-white rounded-2xl shadow p-5 flex flex-col justify-between
            transition-all duration-300 hover:shadow-lg hover:-translate-y-[2px]
          `}
        >
          {/* Gradient top border */}
          <div
            className={`absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl bg-gradient-to-r ${c.accent}`}
          />

          <div className="flex items-center justify-between mb-1">
            <span className="text-[13px] text-gray-500 font-medium">{c.title}</span>
            {c.icon}
          </div>

          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 tracking-tight truncate">
            {c.value}
          </h2>

          <span className="text-green-500 text-[11px] font-semibold mt-1">
            {c.change}
          </span>
        </div>
      ))}
    </div>
  );
}
