package com.finance.kafka.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class TransactionEventDTO {
    private Long transactionId;
    private Long userId;
    private String type;              // EXPENSE/INCOME...
    private String method;            // BANK/CASH...
    private BigDecimal amount;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime transactionDate;
    private String note;
    private Long userCategoryId;      // thêm nếu cần
    private Long savingGoalId;        // thêm nếu cần
}
