// src/components/layout/savings/TransactionSavingList.tsx
"use client";

import React from "react";

export type Deposit = {
  id: number;
  savingId: number;
  amount: number;
  timestamp: string;
  note?: string;
  payment?: string;
};

interface Props {
  deposits: Deposit[];
  onDelete: (id: number) => void;
  onEdit?: (id: number) => void;
  className?: string;
}

const formatDate = (iso?: string) => {
  if (!iso) return "-";
  const d = new Date(iso);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
};

const formatVND = (v: number) => `${v.toLocaleString("vi-VN")}đ`;

export default function TransactionSavingList({
  deposits,
  onDelete,
  onEdit,
  className = "",
}: Props) {
  return (
    <div className={`w-full ${className}`}>
      {/* responsive wrapper: horizontal scroll only when needed */}
      <div className="overflow-x-auto -mx-4">
        <div className="min-w-full px-4">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Note</th>
                <th className="py-3 px-3">Payment</th>
                <th className="py-3 px-3 text-right">Amount</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y bg-white">
              {(!deposits || deposits.length === 0) && (
                <tr>
                  <td colSpan={5} className="py-6 px-3 text-center text-sm text-gray-400">
                    Chưa có khoản nạp nào.
                  </td>
                </tr>
              )}

              {deposits.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-3 align-top whitespace-nowrap text-sm text-gray-700">
                    {formatDate(d.timestamp)}
                  </td>

                  <td className="py-4 px-3 align-top text-sm text-gray-700">
                    <div className="max-w-xl truncate">{d.note ?? "-"}</div>
                  </td>

                  <td className="py-4 px-3 align-top text-sm">
                    {d.payment ? (
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                        {d.payment}
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-50 text-gray-400 rounded">—</span>
                    )}
                  </td>

                  <td className="py-4 px-3 align-top text-sm text-right">
                    <span className="inline-block px-3 py-1 text-sm font-semibold bg-yellow-50 text-yellow-800 rounded">
                      {formatVND(d.amount)}
                    </span>
                  </td>

                  <td className="py-4 px-3 align-top text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => {
                          if (onEdit) return onEdit(d.id);
                          // fallback: quick detail
                          // eslint-disable-next-line no-alert
                          alert(`Detail\n\nAmount: ${formatVND(d.amount)}\nDate: ${new Date(d.timestamp).toLocaleString()}\nNote: ${d.note ?? "-"}`);
                        }}
                        title="Edit"
                        className="p-1 rounded text-gray-500 hover:text-pink-600 hover:bg-gray-50 transition"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <path d="M3 21v-3.75L14.06 6.19l3.75 3.75L6.75 21H3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M18.37 5.63a2.12 2.12 0 113-3L20.5 3.13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>

                      <button
                        onClick={() => {
                          // eslint-disable-next-line no-alert
                          if (confirm("Xác nhận xóa khoản nạp này?")) onDelete(d.id);
                        }}
                        title="Delete"
                        className="p-1 rounded text-red-600 hover:bg-red-50 transition"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <path d="M3 6h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8 6v12a2 2 0 002 2h4a2 2 0 002-2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M10 11v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M14 11v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
