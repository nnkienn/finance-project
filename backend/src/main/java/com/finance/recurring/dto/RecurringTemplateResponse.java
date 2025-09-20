// com.finance.recurring.dto.RecurringTemplateResponse.java
package com.finance.recurring.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.finance.transaction.entity.RecurringFrequency;
import lombok.Builder; import lombok.Value;

@Value @Builder
public class RecurringTemplateResponse {
    Long id;
    Long userCategoryId;
    String categoryName;
    String categoryIcon;

    String providerCode;
    String customerCode;
    BigDecimal limitAmount;
    RecurringFrequency frequency;
    LocalDateTime startAt;
    LocalDateTime endAt;
    boolean active;
    boolean autoPay;
    String note;
}
