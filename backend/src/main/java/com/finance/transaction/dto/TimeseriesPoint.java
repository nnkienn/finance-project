package com.finance.transaction.dto;

import java.math.BigDecimal;

public record TimeseriesPoint(
    String date,
    BigDecimal income,
    BigDecimal expense,
    BigDecimal net
) {}
