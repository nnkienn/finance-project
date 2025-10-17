package com.finance.notification.kafka.sender;

import com.finance.notification.kafka.dto.NotificationEventDTO;

public interface NotificationSender {
    String getChannel(); // "EMAIL", "PUSH", "IN_APP"
    void send(NotificationEventDTO event);
}