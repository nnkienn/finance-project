// com/finance/notification/NotificationDispatcher.java
package com.finance.notification;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.finance.notification.repository.NotificationRepository;

import java.time.Instant;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class NotificationDispatcher {

    private final NotificationRepository repo;

    @Scheduled(fixedDelay = 3000L, initialDelay = 5000L)
    @Transactional
    public void dispatch() {
        List<Notification> batch =
                repo.findTop50ByStatusOrderByCreatedAtAsc(NotificationStatus.PENDING);

        for (var n : batch) {
            try {
                // TODO: gửi thật (email/push). Tạm thời đánh dấu SENT.
                n.setStatus(NotificationStatus.SENT);
                n.setSentAt(Instant.now());
                repo.save(n);
                log.info("📣 SENT notification id={}", n.getId());
            } catch (Exception ex) {
                n.setAttempts(n.getAttempts() + 1);
                if (n.getAttempts() >= 5) n.setStatus(NotificationStatus.FAILED);
                repo.save(n);
                log.warn("⚠️ Send notification failed id={} attempts={}", n.getId(), n.getAttempts(), ex);
            }
        }
    }
}
