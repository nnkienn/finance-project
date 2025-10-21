package com.finance.transaction.kafka.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.finance.transaction.entity.PaymentMethod;
import com.finance.transaction.entity.TransactionType;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionEventDTO {
	private Long transactionId;
	private Long userId;
	private TransactionType type;
	private PaymentMethod method;
	private BigDecimal amount;
	@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
	private LocalDateTime transactionDate;
	private String note;
	private Long userCategoryId;
	private Long savingGoalId;
}
