// src/main/java/com/finance/saving/dto/SavingGoalResponse.java
package com.finance.saving.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record SavingGoalResponse(
    Long id,
    String name,
    BigDecimal targetAmount,
    BigDecimal currentAmount,
    String status,
    LocalDate startDate,
    LocalDate endDate,
    String description,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    double progress // %
) {}
