"use client";

import { useState } from "react";
import NavbarPrivate from "@/components/layout/NavbarPrivate";
import CardInfo from "@/components/layout/dashboard/CardInfo";
import RightSidebar from "@/components/layout/transaction/TransactionRightSidebar";
import TransactionSearchFilter from "@/components/layout/transaction/TransactionSearchFilter";
import TransactionTable from "@/components/layout/transaction/TransactionTable";

export default function Homepage() {
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleExport = (type: "csv" | "pdf") => {
    console.log("Exporting as:", type);
    setShowExportMenu(false);
  };

  const handleCreateTransaction = () => {
    console.log("Redirect to create transaction form...");
    window.location.href = "/transactions/create";
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <NavbarPrivate />
      <main className="pt-24 px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* LEFT */}
          <div className="md:col-span-3">
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
          <div className="md:col-span-6 space-y-6">
            {/* Filter box */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-lg font-semibold mb-6">Transaction</h2>
              <TransactionSearchFilter
                onApply={(filters) => {
                  console.log("Filters applied:", filters);
                }}
              />
            </div>

            {/* Transaction List */}
            <div className="bg-white rounded-2xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Transaction List</h2>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  {/* Export */}
                  <div className="relative">
                    <button
                      onClick={() => setShowExportMenu(!showExportMenu)}
                      className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
                    >
                      Export ⬇
                    </button>
                    {showExportMenu && (
                      <div className="absolute right-0 mt-2 w-36 bg-white border rounded-lg shadow-lg z-20">
                        <button
                          onClick={() => handleExport("csv")}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Export CSV
                        </button>
                        <button
                          onClick={() => handleExport("pdf")}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Export PDF
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Create */}
                  <button
                    onClick={handleCreateTransaction}
                    className="px-4 py-2 bg-pink-500 text-white rounded-lg text-sm font-medium hover:bg-pink-600 transition"
                  >
                    + Create Transaction
                  </button>
                </div>
              </div>

              <TransactionTable />
            </div>
          </div>

          {/* RIGHT */}
          <div className="md:col-span-3">
            <RightSidebar />
          </div>
        </div>
      </main>
    </div>
  );
}
