// src/components/layout/saving/SavingRightSidebar.tsx
"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useAppDispatch } from "@/hook/useAppDispatch";
import { useAppSelector } from "@/hook/useAppSelector";

import SavingTrendChart from "@/components/layout/savings/analystic/SavingTrendChart";
import TopSavingGoalsChart from "@/components/layout/savings/analystic/TopSavingGoalsChart";
import SavingReportChart from "@/components/layout/savings/analystic/SavingReportChart";

import {
  fetchSavingMonthly,
  fetchSavingTopGoals,
  selectSavingMonthly,
  selectSavingTopGoals,
} from "@/store/slice/savingReportSlice";
import { fetchSavingTrend, selectSavingTrend } from "@/store/slice/savingAnalyticsSlice";

export default function SavingRightSidebar() {
  const dispatch = useAppDispatch();

  // selectors (from the slices you pasted)
  const trendData = useAppSelector(selectSavingTrend);
  const monthly = useAppSelector(selectSavingMonthly);
  const topGoals = useAppSelector(selectSavingTopGoals);

  useEffect(() => {
    // load report + analytics
    dispatch(fetchSavingMonthly());
    dispatch(fetchSavingTopGoals());
    dispatch(fetchSavingTrend("MONTHLY"));
  }, [dispatch]);

  return (
    <motion.div
      className="col-span-12 md:col-span-3 space-y-6"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.28 }}
    >
      <div className="bg-white rounded-2xl shadow p-6 space-y-6">
        {/* Trend (compact, height ~180px) */}
        <div>
          <h2 className="text-sm font-semibold text-gray-800 mb-2">Saving Trend (Monthly)</h2>
          <div style={{ height: 180 }}>
            <SavingTrendChart data={trendData || []} compact />
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Top Goals (vertical bars compact, top 3) */}
        <div>
          <h2 className="text-sm font-semibold text-gray-800 mb-2">Top Saving Goals</h2>
          <div style={{ height: 180 }}>
            {/* topGoals items already have shape from service: {id, name, targetAmount, currentAmount, progress} */}
            <TopSavingGoalsChart data={topGoals || []} compact maxItems={3} />
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Monthly Report (compact) */}
        <div>
          <h2 className="text-sm font-semibold text-gray-800 mb-2">Monthly Report</h2>
          <div style={{ height: 180 }}>
            <SavingReportChart
              data={(monthly || []).map((m) => ({ month: m.month, total: m.total ?? 0 }))}
              compact
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
