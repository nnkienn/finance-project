import { Menu } from "@headlessui/react";

export default function ExportMenu({ onExport }: { onExport: (type: "csv" | "pdf") => void }) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
        Export ⬇
      </Menu.Button>
      <Menu.Items className="absolute right-0 mt-2 w-36 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black/10 focus:outline-none z-50">
        <Menu.Item>
          {({ active }) => (
            <button
              onClick={() => onExport("csv")}
              className={`block w-full text-left px-4 py-2 text-sm ${active ? "bg-pink-50" : ""}`}
            >
              Export CSV
            </button>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <button
              onClick={() => onExport("pdf")}
              className={`block w-full text-left px-4 py-2 text-sm ${active ? "bg-pink-50" : ""}`}
            >
              Export PDF
            </button>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
}
