"use client";

import React from "react";

interface PaginationProps {
  page: number; // trang hiện tại (0-based)
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  // Tạo array số trang [0, 1, 2, ... totalPages-1]
  const pages = Array.from({ length: totalPages }, (_, i) => i);

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      {/* Prev */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        className={`px-3 py-1 rounded-md border text-sm ${
          page === 0
            ? "text-gray-400 border-gray-200 bg-gray-100 cursor-not-allowed"
            : "text-gray-700 border-gray-300 hover:bg-gray-100"
        }`}
      >
        Prev
      </button>

      {/* Page numbers */}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-1 rounded-md border text-sm ${
            page === p
              ? "bg-pink-500 text-white border-pink-500"
              : "text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
        >
          {p + 1}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages - 1}
        className={`px-3 py-1 rounded-md border text-sm ${
          page >= totalPages - 1
            ? "text-gray-400 border-gray-200 bg-gray-100 cursor-not-allowed"
            : "text-gray-700 border-gray-300 hover:bg-gray-100"
        }`}
      >
        Next
      </button>
    </div>
  );
}
