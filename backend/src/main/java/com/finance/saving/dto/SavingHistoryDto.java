package com.finance.saving.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record SavingHistoryDto(
        Long id,
        String action,
        BigDecimal amount,
        BigDecimal totalAfter,
        LocalDateTime timestamp
) {}
