"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";

type Input = {
  id?: number;
  name?: string;
  goalName?: string;
  targetAmount?: number;
  currentAmount?: number;
  saved?: number;
  progress?: number;
};

export default function TopSavingGoalsChart({
  data,
  compact,
  maxItems = 3,
}: {
  data: Input[];
  compact?: boolean;
  maxItems?: number;
}) {
  // normalize: compute displayName + progress (cap 100)
  const normalized = (data || [])
    .map((d) => {
      const displayName = d.name ?? d.goalName ?? `Goal ${d.id ?? ""}`;
      const saved = d.currentAmount ?? d.saved ?? 0;
      const target = d.targetAmount ?? 1;
      const progress = Math.min(
        100,
        d.progress ?? Math.round((saved / (target || 1)) * 100)
      );
      return { displayName, progress };
    })
    .filter((x) => x.displayName)
    .sort((a, b) => b.progress - a.progress)
    .slice(0, maxItems);

  // create background dataset with bg = 100 for each item
  const dataWithBg = (normalized.length ? normalized : [{ displayName: "—", progress: 0 }]).map(
    (d) => ({ ...d, bg: 100 })
  );

  // label formatter with compatible signature
  const labelFormatter = (label: React.ReactNode): React.ReactNode => {
    // label may be number|string|undefined
    const num = Number(label as any);
    if (Number.isFinite(num)) return `${num}%`;
    // fallback: return raw label as string (or dash)
    return typeof label === "string" ? label : "-";
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={dataWithBg} margin={{ top: 8, right: 8, bottom: 12, left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.08} vertical={false} />
        <XAxis
          dataKey="displayName"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: compact ? 11 : 12 }}
        />
        <YAxis
          domain={[0, 100]}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: compact ? 11 : 12 }}
          width={48}
        />
        <Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} />

        {/* base lighter bar for context (full 100) */}
        <Bar dataKey="bg" fill="#f3e8ff" barSize={compact ? 20 : 24} radius={[8, 8, 8, 8]} />
        <Bar dataKey="progress" fill="#ec4899" barSize={compact ? 20 : 24} radius={[8, 8, 8, 8]}>
          <LabelList dataKey="progress" position="top" formatter={labelFormatter} style={{ fontSize: compact ? 11 : 12, fontWeight: 600 }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
