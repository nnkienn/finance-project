package com.finance.notification.kafka.sender.impl;

import com.finance.notification.kafka.dto.NotificationEventDTO;
import com.finance.notification.kafka.sender.NotificationSender;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class EmailSender implements NotificationSender {
    @Override
    public String getChannel() {
        return "EMAIL";
    }

    @Override
    public void send(NotificationEventDTO event) {
        log.info("📧 Sending EMAIL to userId={} | title='{}' | body='{}'",
                event.getUserId(), event.getTitle(), event.getBody());
    }
}