package com.finance.transaction.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.finance.transaction.entity.PaymentMethod;
import com.finance.transaction.entity.RecurringFrequency;
import com.finance.transaction.entity.TransactionType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TransactionRequest {
    private BigDecimal amount;
    private TransactionType type;   
    private PaymentMethod paymentMethod;
    private String note;
    private LocalDateTime transactionDate;

    private Long userId;
    private Long userCategoryId;

    private boolean recurring;
    private boolean activeRecurring;
    private RecurringFrequency frequency;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime nextRunTime;
}

