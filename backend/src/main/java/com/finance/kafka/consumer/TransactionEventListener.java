package com.finance.kafka.consumer;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Service;
import com.finance.kafka.dto.TransactionEventDTO;

@Service
public class TransactionEventListener {

    @KafkaListener(topics = "transaction.created", groupId = "finance-app", containerFactory = "kafkaListenerContainerFactory")
    public void listen(TransactionEventDTO event, Acknowledgment ack) {
        System.out.println("📥 Received Kafka event: " + event);
        // TODO: bạn có thể xử lý ở đây (ví dụ: lưu audit log, tạo notification,...)
        ack.acknowledge();
    }
}
