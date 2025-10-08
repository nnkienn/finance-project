package com.finance.saving.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class SavingGoalProgressDto {
    private Long id;
    private String name;
    private BigDecimal currentAmount;
    private BigDecimal targetAmount;
    private double progress; // %
}
