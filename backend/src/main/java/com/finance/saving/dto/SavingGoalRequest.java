// src/main/java/com/finance/saving/dto/SavingGoalRequest.java
package com.finance.saving.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public record SavingGoalRequest(
    @NotBlank(message = "Name is required")
    String name,

    @NotNull @DecimalMin(value = "0.01", message = "Target amount must be > 0")
    BigDecimal targetAmount,

    LocalDate startDate,
    LocalDate endDate,

    String description
) {}
