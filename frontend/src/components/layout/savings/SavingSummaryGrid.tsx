"use client";
import { PiggyBank, Target, Rocket, Award } from "lucide-react";

type Props = {
  totalSaved?: number;
  totalGoals?: number;
  achieved?: number;
  active?: number;
};

export default function SavingSummaryGrid({
  totalSaved = 19478660,
  totalGoals = 4,
  achieved = 2,
  active = 2,
}: Props) {
  const cards = [
    {
      title: "Total Saved",
      value: `$${totalSaved.toLocaleString()}`,
      change: "+15.46%",
      color: "border-pink-500",
      icon: <PiggyBank className="text-pink-500 w-5 h-5" />,
    },
    {
      title: "Total Goals",
      value: totalGoals.toString(),
      change: "+5%",
      color: "border-purple-500",
      icon: <Target className="text-purple-500 w-5 h-5" />,
    },
    {
      title: "Active Goals",
      value: active.toString(),
      change: "+10%",
      color: "border-blue-500",
      icon: <Rocket className="text-blue-500 w-5 h-5" />,
    },
    {
      title: "Achieved Goals",
      value: achieved.toString(),
      change: "+8%",
      color: "border-emerald-500",
      icon: <Award className="text-emerald-500 w-5 h-5" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => (
        <div
          key={i}
          className={`bg-white rounded-2xl shadow p-5 border-t-4 ${c.color} flex flex-col justify-between transition hover:shadow-md`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{c.title}</span>
            {c.icon}
          </div>
          <h2 className="text-2xl font-bold mt-1 text-gray-800">{c.value}</h2>
          <span className="text-green-500 text-xs font-semibold mt-1">
            {c.change}
          </span>
        </div>
      ))}
    </div>
  );
}
