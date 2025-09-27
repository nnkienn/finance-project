"use client";
import { useState } from "react";
import {
  Search,
  LayoutGrid,
  Shuffle,
  FileText,
  Activity,
  Menu,
  X,
} from "lucide-react";
import SettingsMenu from "./SettingsMenu";
import NotificationsMenu from "./NotificationsMenu";

interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export default function NavbarPrivate() {
  const [active, setActive] = useState("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<"settings" | "notifications" | null>(
    null
  );

  const tabs: TabItem[] = [
    { id: "overview", label: "Overview", icon: <LayoutGrid size={16} /> },
    { id: "transaction", label: "Transaction", icon: <Shuffle size={16} /> },
    { id: "category", label: "Category", icon: <FileText size={16} /> },
    { id: "activity", label: "Activity", icon: <Activity size={16} /> },
  ];

  const renderTabButton = (tab: TabItem, mobile = false) => (
    <button
      key={tab.id}
      onClick={() => {
        setActive(tab.id);
        if (mobile) setMobileOpen(false);
      }}
      className={`flex items-center gap-2 px-3 ${
        mobile ? "py-2" : "py-1.5"
      } rounded-lg font-medium text-sm transition ${
        active === tab.id
          ? "bg-purple-100 text-pink-600"
          : mobile
          ? "text-gray-500 hover:text-gray-700"
          : "text-gray-400 hover:text-gray-700"
      }`}
    >
      {tab.icon}
      {tab.label}
    </button>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto w-full h-full flex items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/images/logo.png"
            alt="Logo"
            width={100}
            height={50}
            className="object-contain"
          />
        </div>

        {/* Desktop center */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-6">
          <div className="flex items-center w-56 bg-gray-100 rounded-full px-3 py-1.5 gap-2">
            <Search size={16} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent w-full outline-none text-sm"
            />
          </div>
          <nav className="flex items-center gap-2">
            {tabs.map((tab) => renderTabButton(tab))}
          </nav>
        </div>

        {/* Right desktop */}
        <div className="hidden md:flex items-center gap-5">
          <span className="text-sm font-medium text-gray-700 cursor-pointer">
            EN
          </span>

          <div className="relative">
            <NotificationsMenu
              open={openMenu === "notifications"}
              onToggle={() =>
                setOpenMenu(
                  openMenu === "notifications" ? null : "notifications"
                )
              }
            />
          </div>

          <div className="relative">
            <SettingsMenu
              open={openMenu === "settings"}
              onToggle={() =>
                setOpenMenu(openMenu === "settings" ? null : "settings")
              }
            />
          </div>

          <img
            src="/images/avatar.png"
            alt="User"
            className="w-9 h-9 rounded-full border object-cover cursor-pointer"
          />
        </div>

        {/* Right mobile */}
        <div className="flex md:hidden items-center gap-3">
          <div className="relative">
            <NotificationsMenu
              mobile
              open={openMenu === "notifications"}
              onToggle={() =>
                setOpenMenu(
                  openMenu === "notifications" ? null : "notifications"
                )
              }
            />
          </div>
          <div className="relative">
            <SettingsMenu
              open={openMenu === "settings"}
              onToggle={() =>
                setOpenMenu(openMenu === "settings" ? null : "settings")
              }
            />
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-gray-700"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile full menu */}
      {mobileOpen && (
        <div className="md:hidden fixed top-12 left-0 right-0 bottom-0 bg-white shadow-md animate-dropdown overflow-y-auto z-40">
          <div className="p-4 flex flex-col gap-4">
            <div className="flex items-center w-full bg-gray-100 rounded-full px-3 py-1.5 gap-2">
              <Search size={16} className="text-gray-500" />
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent w-full outline-none text-sm"
              />
            </div>
            <nav className="flex flex-col gap-2 mt-4">
              {tabs.map((tab) => renderTabButton(tab, true))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
