// src/main/java/com/finance/saving/dto/SavingGoalMapper.java
package com.finance.saving.dto;

import com.finance.saving.entity.SavingGoal;

import java.math.BigDecimal;
import java.math.RoundingMode;

public final class SavingGoalMapper {
    private SavingGoalMapper() {}

    public static SavingGoalResponse toResponse(SavingGoal g) {
        double progress = 0d;
        if (g.getTargetAmount() != null &&
            g.getTargetAmount().compareTo(BigDecimal.ZERO) > 0 &&
            g.getCurrentAmount() != null) {
            progress = g.getCurrentAmount()
                        .multiply(BigDecimal.valueOf(100))
                        .divide(g.getTargetAmount(), 2, RoundingMode.HALF_UP)
                        .doubleValue();
        }

        return new SavingGoalResponse(
            g.getId(),
            g.getName(),
            g.getTargetAmount(),
            g.getCurrentAmount(),
            g.getStatus().name(),
            g.getStartDate(),
            g.getEndDate(),
            g.getDescription(),
            g.getCreatedAt(),
            g.getUpdatedAt(),
            progress
        );
    }
}
