"use client";

const mockSavings = [
  { label: "Gaming PC", amount: 309, color: "#ec4899", progress: 30 },
  { label: "New house", amount: 950, color: "#f472b6", progress: 70 },
  { label: "Summer trip", amount: 550, color: "#e879f9", progress: 50 },
  { label: "Wedding", amount: 620, color: "#db2777", progress: 60 },
  { label: "Top up game", amount: 170, color: "#f9a8d4", progress: 20 },
];

export default function MySavings() {
  return (
    <div className="bg-white rounded-2xl shadow p-6 h-[300px] flex flex-col justify-between">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">My Savings</h2>
        <button className="text-sm text-blue-500 hover:underline">View all</button>
      </div>

      <div className="flex flex-col gap-3 mt-3">
        {mockSavings.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-sm text-gray-700">
              <span>{item.label}</span>
              <span className="font-semibold text-gray-900">${item.amount}</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full mt-1">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${item.progress}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
