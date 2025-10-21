package com.finance.notification.websocket;

import com.finance.notification.Notification;
import com.finance.notification.dto.NotificationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class NotificationSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    public void pushNotification(Notification notif) {
        Long userId = notif.getUser().getId();
        String destination = "/topic/notifications/" + userId;

        NotificationResponse dto = NotificationResponse.fromEntity(notif);
        messagingTemplate.convertAndSend(destination, dto);
    }
}
