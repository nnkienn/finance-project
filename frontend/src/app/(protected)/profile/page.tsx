"use client";

import NavbarPrivate from "@/components/layout/NavbarPrivate";
import { useAppDispatch } from "@/hook/useAppDispatch";
import { useAppSelector } from "@/hook/useAppSelector";
import { changePassword, updateProfile, uploadAvatar } from "@/store/slice/authSlice";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatarUrl || null);
  const [fullName, setFullName] = useState<string>(user?.fullName || "");
  const [accountError, setAccountError] = useState<string>("");

  // modal password
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // 🖼️ Chọn & upload ảnh
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Hiển thị preview trước
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);

    try {
      await dispatch(uploadAvatar(file)).unwrap();
      alert("✅ Avatar updated successfully!");
    } catch (err: any) {
      console.error("❌ Upload failed:", err);
      alert(err || "Failed to upload avatar.");
    }
  };

  // 👤 Cập nhật thông tin người dùng
  const handleAccountSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setAccountError("Full name is required.");
      return;
    }

    setAccountError("");
    try {
      await dispatch(updateProfile({ fullName })).unwrap();
      alert("✅ Profile updated successfully!");
    } catch (err: any) {
      setAccountError(err || "Failed to update profile.");
    }
  };

  // 🔐 Đổi mật khẩu
  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }

    setPasswordError("");
    try {
      await dispatch(changePassword({ currentPassword, newPassword })).unwrap();
      alert("✅ Password updated successfully!");
      setShowPasswordModal(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPasswordError(err || "Failed to update password.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 text-gray-800">
      <NavbarPrivate />

      <main className="flex flex-col items-center pt-28 px-4">
        {/* Profile Card */}
        <motion.div
          className="bg-white shadow-lg rounded-3xl p-8 w-full max-w-md text-center relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="relative w-32 h-32 mx-auto mb-5">
            <img
              src={avatarPreview || "/default-avatar.png"}
              alt="Avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-pink-400 shadow-md"
            />
            <label
              htmlFor="avatar"
              className="absolute bottom-1 right-1 bg-pink-500 hover:bg-pink-600 transition text-white text-xs px-3 py-1 rounded-full cursor-pointer"
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

          <h2 className="text-xl font-semibold mb-1">{fullName || "Your Name"}</h2>
          <p className="text-gray-500 text-sm mb-6">{user?.email}</p>

          <form className="space-y-4 text-left" onSubmit={handleAccountSubmit}>
            <div>
              <label className="text-sm text-gray-600">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full border rounded-xl px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            {accountError && <p className="text-sm text-red-500">{accountError}</p>}

            <div className="flex justify-between items-center mt-6">
              <button
                type="submit"
                disabled={loading}
                className={`px-5 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl transition font-medium ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={() => setShowPasswordModal(true)}
                className="text-sm text-pink-500 hover:text-pink-600 underline font-medium"
              >
                Change Password
              </button>
            </div>
          </form>
        </motion.div>

        {/* Password Modal */}
        <AnimatePresence>
          {showPasswordModal && (
            <motion.div
              className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-xl p-8 w-[90%] max-w-md relative"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <h3 className="text-lg font-semibold mb-4 text-center">Change Password</h3>
                <form className="space-y-4" onSubmit={handlePasswordSubmit}>
                  <div>
                    <label className="text-sm text-gray-600">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Confirm Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />
                  </div>
                  {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowPasswordModal(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`px-5 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-medium transition ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {loading ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
