"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/hook/useAppDispatch";
import { useAppSelector } from "@/hook/useAppSelector";
import {
  fetchSavings,
  selectAllSavings,
  selectSavingLoading,
} from "@/store/slice/savingSlice";
import Link from "next/link";
import { motion } from "framer-motion";

export default function MySavings() {
  const dispatch = useAppDispatch();
  const savings = useAppSelector(selectAllSavings);
  const loading = useAppSelector(selectSavingLoading);

  useEffect(() => {
    dispatch(fetchSavings());
  }, [dispatch]);

  const paddedSavings =
    savings.length >= 5
      ? savings.slice(0, 5)
      : [
          ...savings,
          ...Array.from({ length: 5 - savings.length }, (_, i) => ({
            id: `placeholder-${i}`,
            name: "",
            currentAmount: 0,
            targetAmount: 0,
          })),
        ];

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 h-[400px] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-800">My Savings</h2>
        <Link
          href="/savings"
          className="text-sm text-blue-500 hover:text-blue-600 transition"
        >
          View all
        </Link>
      </div>

      {/* Content */}
      {loading === "loading" ? (
        <div className="flex flex-col gap-3 mt-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-full h-8 rounded-md bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse"
            />
          ))}
        </div>
      ) : paddedSavings.length === 0 ? (
        <div className="flex flex-col justify-center items-center flex-1 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10 mb-2 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3m6 1.5A9 9 0 1 1 3 12a9 9 0 0 1 18 0z"
            />
          </svg>
          <p className="text-sm italic">No saving goals yet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 mt-2 overflow-y-auto pr-1">
          {paddedSavings.map((item) => {
            if (!item.name)
              return <div key={item.id} className="h-[42px]" />;

            const progress =
              item.targetAmount > 0
                ? Math.min(
                    Math.round(
                      (item.currentAmount / item.targetAmount) * 100
                    ),
                    100
                  )
                : 0;

            const color =
              progress >= 80
                ? "#16a34a"
                : progress >= 50
                ? "#f59e0b"
                : "#3b82f6";

            return (
              <div key={item.id} className="flex flex-col gap-1">
                {/* Tên + số tiền */}
                <div className="flex justify-between items-baseline">
                  <span className="text-gray-800 font-medium text-sm truncate max-w-[55%]">
                    {item.name}
                  </span>
                  <span className="text-gray-500 font-medium text-[12.5px] tabular-nums">
                    {item.currentAmount.toLocaleString()}{" "}
                    <span className="text-gray-400 font-normal">/</span>{" "}
                    {item.targetAmount.toLocaleString()}
                  </span>
                </div>

                {/* Thanh tiến độ */}
                <div className="w-full h-[6px] bg-gray-100 rounded-full overflow-hidden mt-[2px]">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: color, width: `${progress}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
