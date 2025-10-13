// src/components/charts/SavingReportChart.tsx
"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function SavingReportChart({
  data,
  compact,
}: {
  data: { month: string; total: number }[];
  compact?: boolean;
}) {
  const normalized = (data || []).map((d) => ({ month: d.month, total: d.total ?? 0 }));

  const totals = normalized.map((d) => d.total);
  const min = totals.length ? Math.min(...totals) : 0;
  const max = totals.length ? Math.max(...totals) : 0;
  const pad = Math.max(1, Math.round((max - min) * 0.08));
  const domainMin = Math.max(0, Math.floor((min - pad) / 1000) * 1000);
  const domainMax = Math.ceil((max + pad) / 1000) * 1000;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={normalized} margin={{ top: 6, right: 6, bottom: 6, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.08} />
        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: compact ? 11 : 12 }} height={22} />
        <YAxis domain={[domainMin, domainMax]} tick={{ fontSize: compact ? 11 : 12 }} width={56} />
        <Tooltip formatter={(v: number) => `${v.toLocaleString("vi-VN")} đ`} />
        <Line type="monotone" dataKey="total" stroke="#7c3aed" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
