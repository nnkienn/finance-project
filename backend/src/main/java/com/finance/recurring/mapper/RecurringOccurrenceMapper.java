package com.finance.recurring.mapper;

import com.finance.recurring.dto.RecurringOccurrenceResponse;
import com.finance.recurring.entity.RecurringOccurrence;

public class RecurringOccurrenceMapper {
 public static RecurringOccurrenceResponse toResponse(RecurringOccurrence occ) {
     return RecurringOccurrenceResponse.builder()
             .id(occ.getId())
             .templateId(occ.getTemplate().getId())
             .occurrenceAt(occ.getOccurrenceAt())
             .status(occ.getStatus())
             .amountExpected(occ.getAmountExpected())
             .build();
 }
}
