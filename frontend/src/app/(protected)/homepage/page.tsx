"use client";

import NavbarPrivate from "@/components/layout/NavbarPrivate";
import CardInfo from "@/components/layout/dashboard/CardInfo";
import SummaryCards from "@/components/layout/homepage/SummaryCards";
import MoneyFlowGradientChart from "@/components/layout/homepage/MoneyFlowChart";
import MySavings from "@/components/layout/homepage/MySavings";
import ExpensesPie from "@/components/layout/homepage/ExpensesPie";
import HistoryTransactions from "@/components/layout/homepage/HistoryTransactions";

export default function Homepage() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      <NavbarPrivate />

      {/* ✅ Centered container */}
      <main className="flex-1 pt-24 pb-10 px-4 md:px-8 lg:px-12 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-12 gap-x-5 gap-y-6 items-start">
          {/* LEFT CARD */}
          <div className="col-span-12 md:col-span-3 space-y-3">
            <h2 className="text-lg font-semibold mb-2">My Card</h2>
            <CardInfo
            />
          </div>

          {/* CENTER CONTENT */}
          <div className="col-span-12 md:col-span-9 flex flex-col space-y-[22px] pt-1">
            {/* Summary Cards */}
            <SummaryCards />

            {/* Row 1: Money Flow + My Savings */}
            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-12 lg:col-span-8">
                <MoneyFlowGradientChart />
              </div>
              <div className="col-span-12 lg:col-span-4">
                <MySavings />
              </div>
            </div>

            {/* Row 2: All Expenses + History Transactions */}
            <div className="grid grid-cols-12 gap-5 items-start">
              <div className="col-span-12 lg:col-span-6">
                <ExpensesPie defaultMonth={month} defaultYear={year} />
              </div>
              <div className="col-span-12 lg:col-span-6">
                <HistoryTransactions />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
