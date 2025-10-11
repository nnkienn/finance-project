package com.finance.saving.dto;

import java.math.BigDecimal;

public record SavingMonthlyReportDto(
        String month,
        BigDecimal total
) {}
