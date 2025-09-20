package com.finance.recurring.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.finance.transaction.entity.RecurringFrequency;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RecurringTemplateRequest {
    private Long userCategoryId;         // Category nào? (vd: Internet/Điện)
    private String providerCode;         // optional
    private String customerCode;         // optional
    private BigDecimal limitAmount;      // hạn mức autopay
    private RecurringFrequency frequency;// DAILY/WEEKLY/MONTHLY/YEARLY
    private LocalDateTime startAt;       // kỳ đầu tiên
    private LocalDateTime endAt;         // optional
    private boolean autoPay;             // true => đủ điều kiện thì tự confirm
    private String note;                 // ghi chú
}
