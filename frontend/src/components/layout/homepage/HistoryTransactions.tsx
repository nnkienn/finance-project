"use client";

import { useEffect, useState } from "react";
import { transactionService } from "@/service/transactionService";
import { Transaction } from "@/type/transaction";

export default function HistoryTransactions() {
  const [items, setItems] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    transactionService.getLatestTransactions(5)
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">History Transactions</h2>
        <button className="text-pink-500 text-sm font-medium">View all</button>
      </div>
      {loading ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-500">Chưa có giao dịch.</p>
      ) : (
        <ul className="divide-y">
          {items.map((t) => (
            <li key={t.id} className="py-2 text-sm flex justify-between">
              <span className="text-gray-600">{new Date(t.transactionDate).toLocaleDateString()}</span>
              <span className="truncate mx-2">{t.note}</span>
              <span className="font-medium">{new Intl.NumberFormat().format(Number(t.amount))}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
