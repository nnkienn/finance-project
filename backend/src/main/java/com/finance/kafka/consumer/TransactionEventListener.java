package com.finance.kafka.consumer;

import org.springframework.kafka.annotation.KafkaListener;
	import org.springframework.stereotype.Component;
import com.finance.kafka.dto.TransactionEventDTO;

@Component
public class TransactionEventListener {

	@KafkaListener(
			  topics = "transaction.created",
			  groupId = "finance-app",
			  properties = {
			    "spring.json.use.type.headers=false",
			    "spring.json.value.default.type=com.finance.kafka.dto.TransactionEventDTO"
			  }
			)
			public void listen(TransactionEventDTO dto) {
			    // xử lý...
			}

}
