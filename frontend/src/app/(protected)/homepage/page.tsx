"use client";

import NavbarPrivate from "@/components/layout/NavbarPrivate";
import CardInfo from "@/components/layout/dashboard/CardInfo";
import SummaryCards from "@/components/layout/homepage/SummaryCards";
import MoneyFlowChart from "@/components/layout/homepage/MoneyFlowChart";
import RightSidebar from "@/components/layout/homepage/RightSidebar";

export default function Homepage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <NavbarPrivate />

      <main className="pt-24 px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-12 gap-6">
          {/* LEFT */}
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

          {/* CENTER */}
          <div className="col-span-12 md:col-span-6 space-y-6">
            <SummaryCards defaultMonth={9} defaultYear={2025} />
            <MoneyFlowChart
              defaultFrom="2025-09-01"
              defaultTo="2025-09-31"
              defaultGranularity="DAILY"
            />
          </div>

          {/* RIGHT */}
          <div className="col-span-12 md:col-span-3">
            <RightSidebar defaultMonth={8} defaultYear={2025} />
          </div>
        </div>
      </main>
    </div>
  );
}
