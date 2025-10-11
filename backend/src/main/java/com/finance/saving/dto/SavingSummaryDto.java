package com.finance.saving.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class SavingSummaryDto {
    private BigDecimal totalSaved;   // Tổng tiền đã tiết kiệm
    private int totalGoals;          // Tổng số mục tiêu
    private int achievedGoals;       // Số goal đã đạt
    private int activeGoals;         // Số goal đang tiến hành
}
