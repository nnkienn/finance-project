import CardInfo from "@/components/layout/dashboard/CardInfo";
import NavbarPrivate from "@/components/layout/NavbarPrivate";

export default function Homepage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <NavbarPrivate />

      <main className="pt-24 px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-12 gap-6">
          {/* LEFT: My Card */}
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

            {/* Add card */}
         
          </div>

          {/* CENTER */}
          <div className="col-span-12 md:col-span-6 space-y-6">
            {/* ✅ Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
              {/* Balance */}
              <div className="bg-white rounded-xl shadow p-4 border-l-4 border-blue-500 h-full flex flex-col justify-center">
                <p className="text-sm text-gray-500">My Balance</p>
                <p className="text-xl font-bold">$128,320</p>
              </div>

              {/* Income */}
              <div className="bg-white rounded-xl shadow p-4 border-l-4 border-green-500 h-full flex flex-col justify-center">
                <p className="text-sm text-gray-500">Income</p>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold">$10,500</p>
                  <span className="text-green-600 bg-green-100 text-xs font-medium px-2 py-0.5 rounded">
                    ↑ 11.09%
                  </span>
                </div>
              </div>

              {/* Savings */}
              <div className="bg-white rounded-xl shadow p-4 border-l-4 border-yellow-500 h-full flex flex-col justify-center">
                <p className="text-sm text-gray-500">Savings</p>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold">$5,250</p>
                  <span className="text-green-600 bg-green-100 text-xs font-medium px-2 py-0.5 rounded">
                    ↑ 11.09%
                  </span>
                </div>
              </div>

              {/* Expenses */}
              <div className="bg-white rounded-xl shadow p-4 border-l-4 border-orange-500 h-full flex flex-col justify-center">
                <p className="text-sm text-gray-500">Expenses</p>
                <p className="text-xl font-bold">$3,200</p>
              </div>
            </div>

            {/* Money Flow */}
            <div className="bg-white rounded-2xl shadow p-6 h-72">
              <h2 className="text-lg font-semibold mb-2">Money Flow</h2>
              <p className="text-sm text-gray-500">Chart placeholder</p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-span-12 md:col-span-3 space-y-6">
            {/* My Savings */}
            <div className="bg-white rounded-2xl shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold">My Savings</h2>
                <button className="text-pink-500 text-sm font-medium">
                  View all
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Gaming PC</span>
                  <span>$309</span>
                </div>
                <div className="w-full bg-gray-200 h-1.5 rounded-full">
                  <div className="bg-pink-500 h-1.5 rounded-full w-1/4"></div>
                </div>

                <div className="flex justify-between text-sm">
                  <span>New house</span>
                  <span>$950</span>
                </div>
                <div className="w-full bg-gray-200 h-1.5 rounded-full">
                  <div className="bg-pink-500 h-1.5 rounded-full w-3/4"></div>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Summer trip</span>
                  <span>$550</span>
                </div>
                <div className="w-full bg-gray-200 h-1.5 rounded-full">
                  <div className="bg-pink-500 h-1.5 rounded-full w-2/4"></div>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Wedding</span>
                  <span>$620</span>
                </div>
                <div className="w-full bg-gray-200 h-1.5 rounded-full">
                  <div className="bg-pink-500 h-1.5 rounded-full w-2/3"></div>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Top up game</span>
                  <span>$170</span>
                </div>
                <div className="w-full bg-gray-200 h-1.5 rounded-full">
                  <div className="bg-pink-500 h-1.5 rounded-full w-1/6"></div>
                </div>
              </div>
            </div>

            {/* All Expenses */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-lg font-semibold mb-2">All Expenses</h2>
              <p className="text-sm text-gray-500">Pie chart placeholder</p>
            </div>

            {/* History Transactions */}
            <div className="bg-white rounded-2xl shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold">History Transactions</h2>
                <button className="text-pink-500 text-sm font-medium">
                  View all
                </button>
              </div>
              <p className="text-sm text-gray-500">
                Transactions list placeholder
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
