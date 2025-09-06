"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center bg-transparent backdrop-blur-sm">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center px-6 md:px-12">
        {/* Logo + Menu */}
        <div className="flex items-center gap-6">
          <img
            src="/images/logo.png"
            alt="Logo"
            width={120}
            height={60}
            className="object-contain"
          />

          {/* Menu */}
          <nav className="hidden md:flex items-center gap-6 font-sans font-medium text-purple-800">
            <Link href="/features" className="hover:underline">
              Features
            </Link>
            <Link href="/community" className="hover:underline">
              Community
            </Link>
            <Link href="/about" className="hover:underline">
              About
            </Link>
          </nav>
        </div>

        {/* Right buttons */}
        <div className="hidden md:flex items-center gap-3 font-sans text-sm font-semibold">
          <Link
            href="/plans"
            className="px-6 py-2 rounded-full border-2 border-purple-700 text-purple-800 hover:bg-purple-100 transition"
          >
            Plans & Pricing
          </Link>
          <Link
            href="/signin"
            className="px-6 py-2 rounded-full bg-purple-700 text-white hover:bg-purple-800 transition"
          >
            Sign in
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-purple-800 text-2xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white/90 backdrop-blur-md shadow-lg border-t">
          <nav className="flex flex-col items-start p-4 gap-4 font-sans font-medium text-purple-800">
            <Link href="/features" onClick={() => setOpen(false)}>
              Features
            </Link>
            <Link href="/community" onClick={() => setOpen(false)}>
              Community
            </Link>
            <Link href="/about" onClick={() => setOpen(false)}>
              About
            </Link>
            <Link
              href="/plans"
              className="w-full px-4 py-2 rounded-full border-2 border-purple-700 text-center text-purple-800 hover:bg-purple-100 transition"
              onClick={() => setOpen(false)}
            >
              Plans & Pricing
            </Link>
            <Link
              href="/signin"
              className="w-full px-4 py-2 rounded-full bg-purple-700 text-center text-white hover:bg-purple-800 transition"
              onClick={() => setOpen(false)}
            >
              Sign in
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
