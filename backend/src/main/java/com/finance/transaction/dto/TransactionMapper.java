package com.finance.transaction.dto;

import com.finance.transaction.entity.Transaction;

public class TransactionMapper {
	 public static TransactionResponse toResponse(Transaction transaction) {
	        return TransactionResponse.builder()
	                .id(transaction.getId())
	                .amount(transaction.getAmount())
	                .type(transaction.getType())
	                .paymentMethod(transaction.getPaymentMethod())
	                .note(transaction.getNote())
	                .transactionDate(transaction.getTransactionDate())
	                .categoryName(transaction.getUserCategory().getName())
	                .categoryIcon(transaction.getUserCategory().getIcon())
	                .recurring(transaction.isRecurring())
	                .activeRecurring(transaction.isActiveRecurring())
	                .frequency(transaction.getFrequency() != null ? transaction.getFrequency().name() : null)
	                .build();
	    }
}
