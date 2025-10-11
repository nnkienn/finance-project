package com.finance.saving.dto;

import com.finance.saving.entity.SavingGoalStatus;
import java.math.BigDecimal;
import java.time.LocalDate;

public record SavingGoalSummaryDto(
        Long id,
        String name,
        BigDecimal targetAmount,
        BigDecimal currentAmount,
        LocalDate startDate,
        LocalDate endDate,
        SavingGoalStatus status
) {}
