// com/finance/kafka/consumer/TransactionEventListener.java
package com.finance.transaction.kafka;

import com.finance.transaction.kafka.dto.TransactionEventDTO;
import com.finance.transaction.service.TransactionEventHandler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class TransactionEventListener {

	private final TransactionEventHandler handler;

	@KafkaListener(topics = "transaction.created", groupId = "finance-app", properties = {
			"spring.json.use.type.headers=false",
			"spring.json.value.default.type=com.finance.transaction.kafka.dto.TransactionEventDTO" })
	public void listen(TransactionEventDTO dto) {
		try {
			handler.handle(dto); // ghi audit + tạo notification PENDING
		} catch (Exception ex) {
			log.error("❌ Handle transaction event failed txId={}", dto.getTransactionId(), ex);
		}
	}
}
