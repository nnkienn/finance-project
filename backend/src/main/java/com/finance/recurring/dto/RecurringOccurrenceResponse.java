// com.finance.recurring.dto.RecurringOccurrenceResponse.java
package com.finance.recurring.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.finance.recurring.entity.RecurringStatus;
import lombok.Builder; import lombok.Value;

@Value @Builder
public class RecurringOccurrenceResponse {
    Long id;
    Long templateId;
    LocalDateTime occurrenceAt;
    RecurringStatus status;
    BigDecimal amountExpected;

    Long postedTransactionId; // null nếu chưa post

    // tiện cho UI:
    String categoryName;
    String categoryIcon;
    boolean autoPay;
    BigDecimal limitAmount;
}
