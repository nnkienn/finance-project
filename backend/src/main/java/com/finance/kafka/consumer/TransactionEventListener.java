// com/finance/kafka/consumer/TransactionEventListener.java
package com.finance.kafka.consumer;

import com.finance.kafka.dto.TransactionEventDTO;
import com.finance.kafka.handler.TransactionEventHandler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class TransactionEventListener {

    private final TransactionEventHandler handler;

    @KafkaListener(
        topics = "transaction.created",
        groupId = "finance-app",
        properties = {
            "spring.json.use.type.headers=false",
            "spring.json.value.default.type=com.finance.kafka.dto.TransactionEventDTO"
        }
    )
    public void listen(TransactionEventDTO dto) {
        try {
            handler.handle(dto);   // ghi audit + tạo notification PENDING
        } catch (Exception ex) {
            log.error("❌ Handle transaction event failed txId={}", dto.getTransactionId(), ex);
        }
    }
}
