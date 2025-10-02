package com.finance.kafka.producer;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.finance.kafka.dto.TransactionEventDTO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransactionEventPublisher {
	private final KafkaTemplate<String, Object> kafkaTemplate;
	public void publish(TransactionEventDTO transactionEventDTO) {
		kafkaTemplate.send("transaction.created" , transactionEventDTO);
        System.out.println("🚀 Published transaction event: " + transactionEventDTO);
		
	}
}
