package com.finance.transaction.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.finance.transaction.entity.PaymentMethod;
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

    // chỉ cần categoryId, user lấy từ SecurityUtils
    private Long userCategoryId;
}
