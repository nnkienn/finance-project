package com.finance.transaction.dto;

import java.math.BigDecimal;

public record MonthlyCardsResponse(
  BigDecimal myBalance,
  BigDecimal income,
  BigDecimal savings,
  BigDecimal expenses,
  BigDecimal incomePct,   // % so với tháng trước (optional)
  BigDecimal savingsPct,
  BigDecimal expensesPct
) {}
