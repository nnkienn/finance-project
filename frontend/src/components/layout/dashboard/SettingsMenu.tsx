"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/hook/useAppDispatch";
import { logout } from "@/store/slice/authSlice";
import { User, Bell, Palette, CreditCard, LogOut } from "lucide-react";

export default function SettingsMenu({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  const dispatch = useAppDispatch();
  const menuRef = useRef<HTMLDivElement>(null);

  // 🧠 Đóng menu khi click ra ngoài (sau 50ms để không đụng với click mở)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onToggle();
      }
    };

    let timeoutId: NodeJS.Timeout;
    if (open) {
      timeoutId = setTimeout(() => {
        document.addEventListener("click", handleClickOutside);
      }, 50);
    }

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [open, onToggle]);

  // 🚪 Logout
  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/profile";
  };

  return (
    <div className="relative select-none" ref={menuRef}>
      {/* ⚙️ Nút settings */}
      <div
        onClick={(e) => {
          e.stopPropagation(); // ⛔ không lan sự kiện
          onToggle();
        }}
        className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 cursor-pointer hover:bg-gray-200 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.08c1.527-.878 3.31.905 2.432 2.432a1.724 1.724 0 001.08 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.08 2.573c.878 1.527-.905 3.31-2.432 2.432a1.724 1.724 0 00-2.573 1.08c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.08c-1.527.878-3.31-.905-2.432-2.432a1.724 1.724 0 00-1.08-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.08-2.573c-.878-1.527.905-3.31 2.432-2.432.95.546 2.147.192 2.573-1.08z"
          />
          <circle cx="12" cy="12" r="3" fill="currentColor" />
        </svg>
      </div>

      {/* ⚡ Dropdown menu */}
      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg ring-1 ring-black/5 p-2 z-[9999] origin-top-right transition-all duration-150 ease-out animate-fade-in"
        >
          <ul className="flex flex-col gap-1 text-sm font-medium text-gray-600">
            <li>
              <Link
                href="/settings"
                onClick={onToggle}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-pink-50 hover:text-pink-600 transition"
              >
                <User size={16} /> Profile
              </Link>
            </li>

            <li className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-pink-50 hover:text-pink-600 cursor-pointer transition">
              <Bell size={16} /> Notifications
            </li>

            <li className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-pink-50 hover:text-pink-600 cursor-pointer transition">
              <Palette size={16} /> Theme & Language
            </li>

            <li className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-pink-50 hover:text-pink-600 cursor-pointer transition">
              <CreditCard size={16} /> Billing
            </li>

            <li
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-red-500 hover:bg-red-50 cursor-pointer transition"
            >
              <LogOut size={16} /> Logout
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
