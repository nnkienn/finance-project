package com.finance.notification.kafka.sender.impl;

import org.springframework.stereotype.Component;

import com.finance.notification.kafka.dto.NotificationEventDTO;
import com.finance.notification.kafka.sender.NotificationSender;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class InAppSender implements NotificationSender {
    @Override
    public String getChannel() {
        return "IN_APP";
    }

    @Override
    public void send(NotificationEventDTO event) {
        log.info("🔔 In-app notification for userId={} | title='{}'", event.getUserId(), event.getTitle());
    }
}