package com.finance.notification.kafka;

import com.finance.notification.repository.NotificationRepository;
import com.finance.notification.websocket.NotificationSocketController;
import com.finance.notification.Notification;
import com.finance.notification.NotificationStatus;
import com.finance.notification.kafka.dto.NotificationEventDTO;
import com.finance.notification.kafka.sender.NotificationSenderFactory;
import com.finance.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Slf4j
@Component
@RequiredArgsConstructor
public class NotificationEventListener {

    private final NotificationSenderFactory senderFactory;
    private final NotificationRepository repo;
    private final UserRepository userRepo;
    private final NotificationSocketController socketController;


    @KafkaListener(
        topics = "notification.send",
        groupId = "finance-app",
        properties = {
            "spring.json.use.type.headers=false",
            "spring.json.value.default.type=com.finance.notification.kafka.dto.NotificationEventDTO"
        }
    )
    public void listen(NotificationEventDTO event) {
        var user = userRepo.findById(event.getUserId()).orElse(null);
        if (user == null) {
            log.warn("⚠️ Notification ignored: user not found id={}", event.getUserId());
            return;
        }

        Notification notif = Notification.builder()
                .user(user)
                .type(event.getType())
                .title(event.getTitle())
                .body(event.getBody())
                .payload(event.getPayload())
                .status(NotificationStatus.PENDING)
                .attempts(0)
                .isRead(false)
                .createdAt(Instant.now())
                .build();

        repo.save(notif);

        try {
            var sender = senderFactory.getSender(event.getChannel());
            if (sender == null) {
                log.warn("⚠️ No sender found for channel {}", event.getChannel());
                return;
            }

            sender.send(event);
            notif.setStatus(NotificationStatus.SENT);
            notif.setSentAt(Instant.now());
            log.info("✅ Notification sent successfully to user={} via {}", user.getEmail(), event.getChannel());
            if ("IN_APP".equalsIgnoreCase(event.getChannel())) {
                socketController.pushNotification(notif);
            }

        } catch (Exception ex) {
            notif.setAttempts(notif.getAttempts() + 1);
            notif.setStatus(NotificationStatus.FAILED);
            log.error("❌ Notification sending failed userId={} channel={} err={}",
                    event.getUserId(), event.getChannel(), ex.getMessage());
        }

        repo.save(notif);
    }
}