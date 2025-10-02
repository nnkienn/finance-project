package com.finance.kafka.consumer;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.finance.kafka.dto.TransactionEventDTO;

@Service
public class TransactionEventConsumer {
	
	@KafkaListener(topics = "transaction.created" ,groupId = "finance-app")
	public void consume(TransactionEventDTO event) {
		 System.out.println("📥 Consumed transaction event: " + event);
		
	}
}
