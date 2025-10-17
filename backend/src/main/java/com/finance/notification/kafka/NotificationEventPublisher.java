package com.finance.notification.kafka;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import com.finance.notification.kafka.dto.NotificationEventDTO;

@Slf4j
@Component
@RequiredArgsConstructor
public class NotificationEventPublisher {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publish(NotificationEventDTO event) {
        kafkaTemplate.send("notification.send", event);
        log.info("📤 Published notification.send | userId={} | type={} | channel={}",
                event.getUserId(), event.getType(), event.getChannel());
    }
}
