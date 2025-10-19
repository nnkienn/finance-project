"use client";

import { useEffect } from "react";
import NavbarPrivate from "@/components/layout/NavbarPrivate";
import CardInfo from "@/components/layout/dashboard/CardInfo";
import RightSidebar from "@/components/layout/transaction/TransactionRightSidebar";
import { useAppSelector } from "@/hook/useAppSelector";
import { format } from "date-fns";
import { FileText, CreditCard, PiggyBank, AlertCircle } from "lucide-react";
import { useAppDispatch } from "@/hook/useAppDispatch";
import { fetchActivities } from "@/store/slice/activitySlice";

export default function ActivityPage() {
  const dispatch = useAppDispatch();
  const { items: logs, loading, error } = useAppSelector((s) => s.activity);

  useEffect(() => {
    dispatch(fetchActivities());
  }, [dispatch]);

  const renderIcon = (entityType: string) => {
    switch (entityType) {
      case "Transaction":
        return <CreditCard size={18} className="text-green-500" />;
      case "SavingGoal":
        return <PiggyBank size={18} className="text-pink-500" />;
      case "Category":
        return <FileText size={18} className="text-blue-500" />;
      default:
        return <AlertCircle size={18} className="text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <NavbarPrivate />

      <main className="pt-24 px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-12 gap-6">
          {/* LEFT: My Card */}
          <div className="col-span-12 md:col-span-3">
            <h2 className="text-lg font-semibold mb-4">My Card</h2>
            <CardInfo />
          </div>

          {/* CENTER: Activity timeline */}
          <div className="col-span-12 md:col-span-6 space-y-6">
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Activity Log</h2>

              {loading && (
                <p className="text-gray-500 text-sm text-center">Loading...</p>
              )}
              {error && <p className="text-red-500 text-sm">{error}</p>}

              {!loading && logs.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-6">
                  No activity yet.
                </p>
              )}

              {/* ✅ Timeline list */}
              <ul className="relative border-l border-gray-200 pl-5">
                {logs.map((log) => (
                  <li key={log.id} className="relative pl-4 mb-5">
                    {/* Dot */}
                    <span className="absolute -left-[9px] top-1 w-2 h-2 bg-pink-500 rounded-full" />

                    <div className="flex justify-between items-start gap-4">
                      {/* Left content */}
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="mt-1">{renderIcon(log.entityType)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 text-sm leading-tight">
                            {log.action.replace(/_/g, " ")}
                          </p>
                          <p className="text-xs text-gray-500">
                            {log.entityType} — ID: {log.entityId}
                          </p>
                          {log.payload && (
                            <p className="text-xs text-gray-400 mt-1 line-clamp-1 font-mono">
                              {JSON.stringify(log.payload)}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Time (fixed width) */}
                      <span className="text-[11px] text-gray-400 font-mono w-28 text-right shrink-0">
                        {format(new Date(log.createdAt), "HH:mm dd/MM/yyyy")}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
