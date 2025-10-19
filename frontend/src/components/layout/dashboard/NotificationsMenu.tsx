"use client";

import { useEffect, useCallback } from "react";
import { Bell, CreditCard, AlertCircle, CheckCircle, X } from "lucide-react";
import useNotificationSocket from "@/hook/useNotificationSocket";
import { useAppDispatch } from "@/hook/useAppDispatch";
import {
  fetchNotifications,
  addNotification,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/store/slice/notificationSlice";
import { useAppSelector } from "@/hook/useAppSelector";

export default function NotificationsMenu({
  mobile = false,
  open,
  onToggle,
  userId,
}: {
  mobile?: boolean;
  open: boolean;
  onToggle: () => void;
  userId: number;
}) {
  const dispatch = useAppDispatch();
  const { items: notifications, unreadCount, loading } = useAppSelector(
    (s) => s.notifications
  );

  // 🔹 Load từ backend khi mount
  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  // 🔹 Nhận noti realtime từ WebSocket
  const handleNewNotification = useCallback(
    (notif: any) => {
      dispatch(
        addNotification({
          id: notif.id || Date.now(),
          type: notif.type,
          title: notif.title,
          body: notif.body,
          status: "SENT",
          isRead: false,
          createdAt: new Date().toISOString(),
        })
      );
    },
    [dispatch]
  );

  useNotificationSocket(userId, handleNewNotification);

  const renderIcon = (type?: string) => {
    if (type === "transaction.created")
      return <CreditCard size={18} className="text-green-500" />;
    if (type === "saving.expired")
      return <AlertCircle size={18} className="text-red-500" />;
    return <CheckCircle size={18} className="text-blue-500" />;
  };

  return (
    <div className={mobile ? "" : "relative"}>
      {/* 🔔 Bell */}
      <div
        onClick={onToggle}
        className="relative flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 cursor-pointer hover:bg-gray-200"
      >
        <Bell className="text-gray-600" size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </div>

      {/* 💻 Desktop dropdown */}
      {!mobile && open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border z-[60] max-h-96 overflow-y-auto animate-dropdown">
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-gray-700">
                Notifications
              </h4>
              {unreadCount > 0 && (
                <button
                  onClick={() => dispatch(markAllNotificationsRead())}
                  className="text-xs text-purple-600 hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>

            {loading ? (
              <p className="text-sm text-gray-400 p-3 text-center">Loading...</p>
            ) : notifications.length === 0 ? (
              <p className="text-sm text-gray-400 p-3 text-center">
                No notifications yet
              </p>
            ) : (
              <ul className="flex flex-col gap-2 text-sm text-gray-600">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    onClick={() => dispatch(markNotificationRead(n.id))} // 👈 mark read
                    className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition ${
                      n.isRead ? "hover:bg-gray-50" : "bg-purple-50"
                    }`}
                  >
                    {renderIcon(n.type)}
                    <div>
                      <p className="font-medium">{n.title}</p>
                      <span className="text-xs text-gray-400">{n.body}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}

  
          </div>
        </div>
      )}

      {/* 📱 Mobile full-screen */}
      {mobile && open && (
        <div className="fixed inset-0 bg-white z-[70] flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            <h4 className="text-base font-semibold">Notifications</h4>
            <button onClick={onToggle}>
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <p className="text-gray-400 text-sm text-center mt-10">
                Loading...
              </p>
            ) : notifications.length === 0 ? (
              <p className="text-gray-400 text-sm text-center mt-10">
                No notifications yet
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    onClick={() => dispatch(markNotificationRead(n.id))}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer ${
                      n.isRead ? "hover:bg-gray-50" : "bg-purple-50 border-purple-100"
                    }`}
                  >
                    {renderIcon(n.type)}
                    <div>
                      <p className="font-medium">{n.title}</p>
                      <span className="text-xs text-gray-500">{n.body}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={() => dispatch(markAllNotificationsRead())}
              className="p-4 text-sm text-purple-600 font-medium border-t hover:underline"
            >
              Mark all as read
            </button>
          )}
        </div>
      )}
    </div>
  );
}
