// src/components/charts/SavingTrendChart.tsx
"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SavingTrendChart({
  data,
  compact,
}: {
  data: { month?: string; period?: string; total?: number; amount?: number }[];
  compact?: boolean;
}) {
  const normalized = (data || []).map((d) => ({
    month: d.month ?? d.period,
    total: d.total ?? d.amount ?? 0,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={normalized} margin={{ top: 6, right: 6, bottom: 6, left: 0 }}>
        <defs>
          <linearGradient id="gTrendCompact" x1="0" x2="0" y1="0" y2="1">
            <stop offset="6%" stopColor="#ec4899" stopOpacity={0.18} />
            <stop offset="95%" stopColor="#ec4899" stopOpacity={0.02} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.08} />
        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: compact ? 11 : 12 }} height={22}/>
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: compact ? 11 : 12 }}
          width={56}
          tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`)}
        />
        <Tooltip formatter={(v: number) => `${v.toLocaleString("vi-VN")} đ`} />
        <Area type="monotone" dataKey="total" stroke="#ec4899" strokeWidth={2} fill="url(#gTrendCompact)" dot={false} activeDot={{ r: 4 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
