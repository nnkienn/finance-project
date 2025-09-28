"use client";

import { UserCategory } from "@/type/UserCategory";

interface Props {
  open: boolean;
  editing: UserCategory | null;
  formName: string;
  formIcon: string;
  setFormName: (v: string) => void;
  setFormIcon: (v: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

const emojiList = ["🍔", "🚗", "✈️", "🏠", "💡", "🎁", "💰", "📚", "🎵", "🛒"];

export default function UserCategoryModal({
  open,
  editing,
  formName,
  formIcon,
  setFormName,
  setFormIcon,
  onClose,
  onSubmit,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          {editing ? "✏️ Edit Category" : "➕ Create New Category"}
        </h3>

        <div className="space-y-4">
          {/* Category Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name
            </label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Enter category name..."
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-400 focus:outline-none"
            />
          </div>

          {/* Category Icon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Icon (emoji)
            </label>
            <input
              type="text"
              value={formIcon}
              onChange={(e) => setFormIcon(e.target.value)}
              placeholder="Example: ✈️ 🍔 🏠"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-400 focus:outline-none"
            />

            {/* Emoji Picker */}
            <div className="mt-2 flex flex-wrap gap-2">
              {emojiList.map((emoji, idx) => (
                <button
                  key={idx}
                  onClick={() => setFormIcon(emoji)}
                  type="button"
                  className={`px-2 py-1 text-xl rounded-lg border hover:bg-gray-100 ${
                    formIcon === emoji ? "border-pink-500" : "border-gray-200"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            type="button"
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
          >
            {editing ? "Save Changes" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
