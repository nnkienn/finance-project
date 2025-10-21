package com.finance.outbox.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.finance.outbox.OutboxEvent;
import com.finance.outbox.repository.OutboxEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;

/**
 * ✅ OutboxService
 *
 * Dùng để lưu event vào bảng OUTBOX (status = PENDING) trong cùng transaction
 * DB với business logic.
 *
 * Mục tiêu: - Đảm bảo event không bị mất khi Kafka lỗi - OutboxPublisher sẽ xử
 * lý việc gửi thật
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OutboxService {

	private final OutboxEventRepository outboxRepo;
	// ❌ bỏ dòng này: private final ObjectMapper objectMapper = new ObjectMapper();
	// ✅ dùng bean do Spring inject
	private final ObjectMapper objectMapper;

	public void saveEvent(String aggregateType, String aggregateId, String eventType, Object payload) {
		try {
			// object -> JsonNode (đúng kiểu cột jsonb)
			var payloadNode = objectMapper.valueToTree(payload);

			OutboxEvent event = new OutboxEvent();
			event.setAggregateType(aggregateType);
			event.setAggregateId(aggregateId);
			event.setEventType(eventType);
			event.setPayload(payloadNode); // <-- dùng JsonNode
			event.setStatus("PENDING");
			event.setAttempts(0);
			event.setCreatedAt(Instant.now());

			outboxRepo.save(event);
			log.info("📩 Outbox event saved [{}] type={} aggregateId={}", eventType, aggregateType, aggregateId);
		} catch (Exception e) {
			log.error("❌ Failed to save outbox event {}: {}", eventType, e.getMessage());
			throw new RuntimeException("Failed to serialize outbox payload", e);
		}
	}
}
