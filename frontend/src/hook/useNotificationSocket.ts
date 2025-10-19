import { useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export default function useNotificationSocket(
  userId: number | null,
  onMessage: (msg: any) => void
) {
  useEffect(() => {
    if (!userId) return;

    // ✅ Lấy endpoint từ env (fallback localhost)
    const wsUrl =
      process.env.NEXT_PUBLIC_WS_BASE_URL || "http://localhost:8080/ws";

    const socket = new SockJS(wsUrl);
    const client = new Client({
      webSocketFactory: () => socket as any,
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      console.log("✅ Connected to WebSocket:", wsUrl);
      client.subscribe(`/topic/notifications/${userId}`, (message) => {
        const data = JSON.parse(message.body);
        onMessage(data);
      });
    };

    client.onStompError = (frame) => {
      console.error("❌ Broker error:", frame.headers["message"]);
      console.error("Details:", frame.body);
    };

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [userId, onMessage]);
}
