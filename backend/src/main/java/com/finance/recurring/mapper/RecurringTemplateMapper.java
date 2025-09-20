package com.finance.recurring.mapper;


import com.finance.recurring.dto.RecurringTemplateResponse;
import com.finance.recurring.entity.RecurringTemplate;

public class RecurringTemplateMapper {
 public static RecurringTemplateResponse toResponse(RecurringTemplate tpl) {
     return RecurringTemplateResponse.builder()
             .id(tpl.getId())
             .userCategoryId(tpl.getUserCategory().getId())
             .categoryName(tpl.getUserCategory().getName())
             .limitAmount(tpl.getLimitAmount())
             .frequency(tpl.getFrequency())
             .startAt(tpl.getStartAt())
             .endAt(tpl.getEndAt())
             .active(tpl.isActive())
             .autoPay(tpl.isAutoPay())
             .note(tpl.getNote())
             .build();
 }
}
