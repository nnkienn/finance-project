// com.finance.recurring.dto.RecurringMapper.java
package com.finance.recurring.mapper;

import com.finance.recurring.dto.RecurringOccurrenceResponse;
import com.finance.recurring.dto.RecurringTemplateResponse;
import com.finance.recurring.entity.RecurringOccurrence;
import com.finance.recurring.entity.RecurringTemplate;

public class RecurringMapper {

    public static RecurringTemplateResponse toResponse(RecurringTemplate t) {
        return RecurringTemplateResponse.builder()
                .id(t.getId())
                .userCategoryId(t.getUserCategory().getId())
                .categoryName(t.getUserCategory().getName())
                .categoryIcon(t.getUserCategory().getIcon())
                .providerCode(t.getProviderCode())
                .customerCode(t.getCustomerCode())
                .limitAmount(t.getLimitAmount())
                .frequency(t.getFrequency())
                .startAt(t.getStartAt())
                .endAt(t.getEndAt())
                .active(t.isActive())
                .autoPay(t.isAutoPay())
                .note(t.getNote())
                .build();
    }

    public static RecurringOccurrenceResponse toResponse(RecurringOccurrence o) {
        return RecurringOccurrenceResponse.builder()
                .id(o.getId())
                .templateId(o.getTemplate().getId())
                .occurrenceAt(o.getOccurrenceAt())
                .status(o.getStatus())
                .amountExpected(o.getAmountExpected())
                .postedTransactionId(o.getPostedTransaction() != null ? o.getPostedTransaction().getId() : null)
                .categoryName(o.getTemplate().getUserCategory().getName())
                .categoryIcon(o.getTemplate().getUserCategory().getIcon())
                .autoPay(o.getTemplate().isAutoPay())
                .limitAmount(o.getTemplate().getLimitAmount())
                .build();
    }
}
