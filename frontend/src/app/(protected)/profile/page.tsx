"use client";
import NavbarPrivate from "@/components/layout/NavbarPrivate";
import { useState } from "react";

export default function SettingsPage() {
  const [avatar, setAvatar] = useState<string | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <NavbarPrivate />
      <main className="pt-24 px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-12 gap-8">
          {/* LEFT: Profile Card */}
          <div className="col-span-12 md:col-span-4">
            <div className="bg-white rounded-2xl shadow p-6 text-center">
              <div className="relative w-28 h-28 mx-auto mb-4">
                <img
                  src={avatar || "/default-avatar.png"}
                  alt="Avatar"
                  className="w-28 h-28 rounded-full object-cover border-4 border-pink-400"
                />
                <label
                  htmlFor="avatar"
                  className="absolute bottom-0 right-0 bg-pink-500 text-white text-xs px-2 py-1 rounded-full cursor-pointer"
                >
                  Change
                </label>
                <input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              <h2 className="text-lg font-semibold">Brandy Tran</h2>
              <p className="text-sm text-gray-500">brandytran@email.com</p>
            </div>
          </div>

          {/* RIGHT: Settings Form */}
          <div className="col-span-12 md:col-span-8 space-y-8">
            {/* Account Info */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Account Information</h3>
              <form className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600"
                >
                  Save Changes
                </button>
              </form>
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Change Password</h3>
              <form className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Current Password</label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600"
                >
                  Update Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
