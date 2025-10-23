"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800">
        <div className="bg-white p-10 rounded-2xl shadow-md flex flex-col items-center gap-6">
          <div className="bg-pink-100 p-4 rounded-full">
            <AlertTriangle className="text-pink-600 w-10 h-10" />
          </div>

          <h1 className="text-3xl font-semibold text-gray-900">Something went wrong</h1>
          <p className="text-gray-500 text-center max-w-sm">
            Please try again or return to your dashboard.
          </p>

          <div className="flex gap-3">
            <button
              onClick={reset}
              className="px-5 py-2.5 rounded-lg font-medium text-white bg-pink-500 hover:bg-pink-600 transition-all"
            >
              Try Again
            </button>

            <Link
              href="/homepage"
              className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all"
            >
              Go Home
            </Link>
          </div>
        </div>

        <p className="text-sm text-gray-400 mt-6">© {new Date().getFullYear()} Knance</p>
      </body>
    </html>
  );
}
