// com/finance/kafka/handler/TransactionEventHandler.java
package com.finance.transaction.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.finance.audit.entity.AuditLog;
import com.finance.audit.repository.AuditLogRepository;
import com.finance.notification.kafka.dto.NotificationEventDTO;
import com.finance.notification.repository.NotificationRepository;
import com.finance.transaction.kafka.dto.TransactionEventDTO;
import com.finance.auth.entity.User;
import com.finance.auth.repository.UserRepository; // nếu cần load user
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class TransactionEventHandler {

	private final AuditLogRepository auditRepo;
	private final NotificationRepository notifRepo;
	private final ObjectMapper mapper;
	private final UserRepository userRepo; // nếu cần set quan hệ user
	private final com.finance.notification.kafka.NotificationEventPublisher notificationEventPublisher;

	@Transactional
	public void handle(TransactionEventDTO dto) {
		// JSON payload từ DTO
		var payload = mapper.valueToTree(dto); // JsonNode

		AuditLog audit = AuditLog.builder().userId(dto.getUserId()).action("TRANSACTION_CREATED")
				.entityType("Transaction").entityId(String.valueOf(dto.getTransactionId())).payload(payload)
				.createdAt(Instant.now()).build();
		auditRepo.save(audit);

		User user = userRepo.findById(dto.getUserId())
				.orElseThrow(() -> new IllegalStateException("User not found: " + dto.getUserId()));

		notificationEventPublisher
				.publish(NotificationEventDTO.builder().userId(dto.getUserId()).type("transaction.created")
						.title("Giao dịch mới").body("Bạn vừa tạo giao dịch " + dto.getAmount() + "₫").channel("IN_APP") // 🔔
																															// chỉ
																															// in-app
						.build());

	}

}
