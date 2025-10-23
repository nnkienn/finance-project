"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800">
      <div className="bg-white p-10 rounded-2xl shadow-md flex flex-col items-center gap-6">
        <div className="bg-pink-100 p-4 rounded-full">
          <AlertTriangle className="text-pink-600 w-10 h-10" />
        </div>

        <h1 className="text-3xl font-semibold text-gray-900">404 | Page Not Found</h1>
        <p className="text-gray-500 text-center max-w-sm">
          The page you are looking for doesn’t exist or has been moved.
        </p>

        <Link
          href="/homepage"
          className="px-5 py-2.5 rounded-lg font-medium text-white bg-pink-500 hover:bg-pink-600 transition-all"
        >
          Go Back Home
        </Link>
      </div>

      <p className="text-sm text-gray-400 mt-6">© {new Date().getFullYear()} Knance</p>
    </div>
  );
}
