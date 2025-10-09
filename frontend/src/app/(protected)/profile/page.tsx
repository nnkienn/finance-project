"use client";
import NavbarPrivate from "@/components/layout/NavbarPrivate";
import { useAppDispatch } from "@/hook/useAppDispatch";
import { useAppSelector } from "@/hook/useAppSelector";
import { changePassword, updateProfile } from "@/store/slice/authSlice";
import { useState } from "react";

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);

  const [avatar, setAvatar] = useState<string | null>(user?.avatarUrl || null);
  const [fullName, setFullName] = useState<string>(user?.fullName || "");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [accountError, setAccountError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  // 🖼️ Chọn ảnh
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // 👤 Cập nhật thông tin người dùng (chỉ fullName + avatar)
  const handleAccountSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!fullName) {
      setAccountError("Full name is required.");
      return;
    }

    setAccountError("");
    try {
      await dispatch(updateProfile({ fullName, avatarUrl: avatar || undefined })).unwrap();
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
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPasswordError(err || "Failed to update password.");
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
              <h2 className="text-lg font-semibold">{fullName || "Your Name"}</h2>
              <p className="text-sm text-gray-500">{user?.email || "your@email.com"}</p>
            </div>
          </div>

          {/* RIGHT: Settings Form */}
          <div className="col-span-12 md:col-span-8 space-y-8">
            {/* Account Info */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
              <form className="space-y-4" onSubmit={handleAccountSubmit}>
                <div>
                  <label className="text-sm text-gray-600">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Email Address</label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                </div>

                {accountError && <p className="text-sm text-red-500">{accountError}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Change Password</h3>
              <form className="space-y-4" onSubmit={handlePasswordSubmit}>
                <div>
                  <label className="text-sm text-gray-600">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
