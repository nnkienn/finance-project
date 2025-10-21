package com.finance.notification.dto;

import com.fasterxml.jackson.databind.JsonNode;
import com.finance.notification.Notification;
import com.finance.notification.NotificationStatus;
import java.time.Instant;

public record NotificationResponse(
        Long id,
        String type,
        String title,
        String body,
        JsonNode payload,
        NotificationStatus status,
        boolean isRead,
        Instant createdAt,
        Instant sentAt
) {
    public static NotificationResponse fromEntity(Notification n) {
        return new NotificationResponse(
                n.getId(),
                n.getType(),
                n.getTitle(),
                n.getBody(),
                n.getPayload(),
                n.getStatus(),
                n.isRead(),
                n.getCreatedAt(),
                n.getSentAt()
        );
    }
}
