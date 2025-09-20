package com.finance.recurring.dto;

import java.math.BigDecimal;

import lombok.*;

@Getter @Setter
public class OccurrenceActionRequest {
	private BigDecimal amountExpected;
}
