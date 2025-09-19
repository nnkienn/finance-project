package com.finance.transaction.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.finance.transaction.entity.PaymentMethod;
import com.finance.transaction.entity.TransactionType;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class TransactionResponse {
    private Long id;
    private BigDecimal amount;
    private TransactionType type;
    private PaymentMethod paymentMethod;
    private String note;
    private LocalDateTime transactionDate;

    private String categoryName;
    private String categoryIcon;

    // NEW: nếu giao dịch sinh từ recurring occurrence, trả id để UI hiển thị nguồn
    private Long recurringOccurrenceId;
}
