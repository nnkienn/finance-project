package com.finance.kafka.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionEventDTO {
	 private Long transactionId;
	    private Long userId;
	    private BigDecimal amount;
	    private String type;
	    private String method;
	    private LocalDateTime transactionDate;
}
