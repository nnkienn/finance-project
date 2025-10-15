package com.finance.outbox.service;


import com.fasterxml.jackson.databind.JsonNode;
import com.finance.outbox.OutboxEvent;
import com.finance.outbox.repository.OutboxEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class OutboxPublisher {

    private final OutboxEventRepository outboxRepo;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    private static final int MAX_ATTEMPTS = 10;

    /**
     * Quét outbox mỗi 2s: lấy PENDING/RETRY, claim -> gửi -> cập nhật.
     */
    @Scheduled(fixedDelay = 2000)
    @Transactional
    public void publishPending() {
        List<OutboxEvent> events =
                outboxRepo.findTop100ByStatusInAndAttemptsLessThanOrderByCreatedAtAsc(
                        List.of("PENDING", "RETRY"), MAX_ATTEMPTS);

        for (OutboxEvent ev : events) {
            // Claim để tránh 2 instance xử lý cùng 1 bản ghi
            int changed = outboxRepo.tryChangeStatus(ev.getId(), ev.getStatus(), "SENDING");
            if (changed == 0) {
                continue; // đã bị instance khác claim
            }

            try {
                String topic = ev.getEventType();   // ví dụ: "transaction.created"
                String key   = ev.getAggregateId(); // giữ order theo aggregate

                JsonNode payload = ev.getPayload(); // JsonNode (đã map JSONB)
                // JsonSerializer của Spring Kafka serialize được JsonNode
                kafkaTemplate.send(topic, key, payload).get(); // chờ kết quả để biết có lỗi

                ev.setStatus("SUCCESS");
                outboxRepo.save(ev);
                log.info("✅ Published outbox id={} topic={} key={}", ev.getId(), topic, key);
            } catch (Exception ex) {
                ev.setAttempts(ev.getAttempts() + 1);
                ev.setStatus(ev.getAttempts() >= MAX_ATTEMPTS ? "FAILED" : "RETRY");
                outboxRepo.save(ev);
                log.warn("⚠️ Publish failed id={} attempts={} -> status={} err={}",
                        ev.getId(), ev.getAttempts(), ev.getStatus(), ex.getMessage());
            }
        }
    }
}
