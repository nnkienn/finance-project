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
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <NavbarPrivate />

      <main className="pt-24 px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-12 gap-6">
          {/* LEFT CARD */}
          <div className="col-span-12 md:col-span-3">
            <h2 className="text-lg font-semibold mb-4">My Card</h2>
            <CardInfo
              name="Knance"
              number="1234 1234 1234 1234"
              holder="OMI GUSTY"
              expiry="06/24"
              balance={128320}
              up={23.12}
              down={23.12}
              currency="USD / US Dollar"
              status="Active"
            />
          </div>

          {/* CENTER CONTENT */}
          <div className="col-span-12 md:col-span-9 space-y-6">
            {/* Summary Cards */}
            <SummaryCards defaultMonth={month} defaultYear={year} />

            {/* Row 1: Money Flow + My Savings */}
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-8">
                <MoneyFlowGradientChart />
              </div>
              <div className="col-span-12 lg:col-span-4">
                <MySavings />
              </div>
            </div>

           {/* Row 2: All Expenses + History Transactions */}
<div className="grid grid-cols-12 gap-6 items-stretch">
  {/* All Expenses */}
  <div className="col-span-12 lg:col-span-6">
    <div className="h-full min-h-[320px]">
      <ExpensesPie defaultMonth={month} defaultYear={year} />
    </div>
  </div>

  {/* History Transactions */}
  <div className="col-span-12 lg:col-span-6">
    <div className="h-full min-h-[320px]">
      <HistoryTransactions />
    </div>
  </div>
</div>

          </div>
        </div>
      </main>
    </div>
  );
}
