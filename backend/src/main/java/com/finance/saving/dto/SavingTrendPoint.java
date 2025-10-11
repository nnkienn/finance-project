package com.finance.saving.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class SavingTrendPoint {
    private String period;        // ví dụ: "2025-01" hoặc "2025-W10"
    private BigDecimal amount;    // tổng tiền tiết kiệm tại thời điểm đó
}
