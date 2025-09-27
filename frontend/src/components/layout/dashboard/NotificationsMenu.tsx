"use client";
import { Bell, CreditCard, AlertCircle, CheckCircle, X } from "lucide-react";

export default function NotificationsMenu({
  mobile = false,
  open,
  onToggle,
}: {
  mobile?: boolean;
  open: boolean;
  onToggle: () => void;
}) {
  const notifications = [
    { id: 1, icon: <CreditCard size={18} className="text-green-500" />, title: "Payment Successful", desc: "You paid $50 for Plan Pro" },
    { id: 2, icon: <AlertCircle size={18} className="text-yellow-500" />, title: "Budget Limit Reached", desc: "90% of your monthly budget used" },
    { id: 3, icon: <CheckCircle size={18} className="text-blue-500" />, title: "Report Ready", desc: "Your expense report is available" },
  ];

  return (
    <div className={mobile ? "" : "relative"}>
      {/* Bell */}
      <div
        onClick={onToggle}
        className="relative flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 cursor-pointer hover:bg-gray-200"
      >
        <Bell className="text-gray-600" size={18} />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
          {notifications.length}
        </span>
      </div>

      {/* Desktop dropdown — bám theo wrapper (chuông) */}
      {!mobile && open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border z-[60] max-h-96 overflow-y-auto animate-dropdown">
          <div className="p-3">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Notifications</h4>
            <ul className="flex flex-col gap-2 text-sm text-gray-600">
              {notifications.map((n) => (
                <li key={n.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition">
                  {n.icon}
                  <div>
                    <p className="font-medium">{n.title}</p>
                    <span className="text-xs text-gray-400">{n.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
            <button className="mt-3 w-full text-sm text-purple-600 font-medium hover:underline">View All</button>
          </div>
        </div>
      )}

      {/* Mobile full-screen */}
      {mobile && open && (
        <div className="fixed inset-0 bg-white z-[70] flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            <h4 className="text-base font-semibold">Notifications</h4>
            <button onClick={onToggle}><X size={20} className="text-gray-600" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <ul className="flex flex-col gap-3">
              {notifications.map((n) => (
                <li key={n.id} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
                  {n.icon}
                  <div>
                    <p className="font-medium">{n.title}</p>
                    <span className="text-xs text-gray-500">{n.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
