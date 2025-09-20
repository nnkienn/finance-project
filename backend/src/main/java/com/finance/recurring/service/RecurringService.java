package com.finance.recurring.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.finance.auth.entity.User;
import com.finance.auth.util.SecurityUtils;
import com.finance.category.entity.UserCategory;
import com.finance.category.repository.UserCategoryRepository;
import com.finance.recurring.dto.OccurrenceActionRequest;
import com.finance.recurring.dto.RecurringTemplateRequest; // <-- DÙNG DTO
import com.finance.recurring.entity.RecurringOccurrence;
import com.finance.recurring.entity.RecurringStatus;
import com.finance.recurring.entity.RecurringTemplate;
import com.finance.recurring.repository.RecurringOccurrenceRepository;
import com.finance.recurring.repository.RecurringTemplateRepository;
import com.finance.transaction.entity.PaymentMethod;
import com.finance.transaction.entity.RecurringFrequency;
import com.finance.transaction.entity.Transaction;
import com.finance.transaction.entity.TransactionType;
import com.finance.transaction.port.RecurringPostingPort;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecurringService {

    private final RecurringTemplateRepository templateRepo;
    private final RecurringOccurrenceRepository occurrenceRepo;
    private final UserCategoryRepository userCategoryRepo;

    private final RecurringPostingPort postingPort;

    /** create template + sinh occurrence đầu tiên (PLANNED) tại startAt */
    @Transactional
    public RecurringTemplate createTemplate(RecurringTemplateRequest req) { // <-- DÙNG DTO
        User user = SecurityUtils.getCurrentUser();

        // Lấy đúng categoryId từ request
        UserCategory userCategory = userCategoryRepo
            .findByIdAndUserId(req.getUserCategoryId(), user.getId()) // <-- SỬA Ở ĐÂY
            .orElseThrow(() -> new RuntimeException("Category không thuộc user"));

        if (req.getFrequency() == null || req.getStartAt() == null) {
            throw new RuntimeException("frequency/startAt là bắt buộc");
        }
        if (req.getEndAt() != null && req.getEndAt().isBefore(req.getStartAt())) {
            throw new RuntimeException("endAt phải >= startAt");
        }

        RecurringTemplate tpl = RecurringTemplate.builder()
                .user(user)
                .userCategory(userCategory)
                .providerCode(req.getProviderCode())
                .customerCode(req.getCustomerCode())
                .limitAmount(req.getLimitAmount())
                .frequency(req.getFrequency())
                .startAt(req.getStartAt())
                .endAt(req.getEndAt())
                .active(true)
                .autoPay(req.isAutoPay())
                .note(req.getNote())
                .build();
        RecurringTemplate saved = templateRepo.save(tpl);

        // Sinh occurrence đầu tiên (PLANNED)
        RecurringOccurrence first = RecurringOccurrence.builder()
                .template(saved)
                .occurrenceAt(req.getStartAt())
                .status(RecurringStatus.PLANNED)
                .build();
        occurrenceRepo.save(first);

        return saved;
    }

    /** Danh sách kỳ đến hạn của user: PLANNED và occurrenceAt <= now */
    @Transactional(readOnly = true)
    public List<RecurringOccurrence> getDueOccurrences() {
        User user = SecurityUtils.getCurrentUser();
        return occurrenceRepo.findDueByUser(user, LocalDateTime.now());
    }

    /** Confirm tay 1 kỳ: tạo Transaction, set POSTED, sinh kỳ tiếp theo */
    @Transactional // <-- THÊM
    public Transaction confirmOccurrence(Long occurrenceId, OccurrenceActionRequest req) {
        User user = SecurityUtils.getCurrentUser();

        RecurringOccurrence occ = occurrenceRepo.findById(occurrenceId)
                .orElseThrow(() -> new RuntimeException("Occurrence không tồn tại"));

        if (!occ.getTemplate().getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Occurrence không thuộc user");
        }
        if (occ.getStatus() != RecurringStatus.PLANNED && occ.getStatus() != RecurringStatus.REVIEW) {
            throw new RuntimeException("Chỉ confirm khi trạng thái là PLANNED/REVIEW");
        }
        if (!occ.getTemplate().isActive()) {
            throw new RuntimeException("Template đang tắt (inactive)");
        }
        // Idempotent
        if (occ.getPostedTransaction() != null) {
            return occ.getPostedTransaction();
        }

        BigDecimal amount = (req != null && req.getAmountExpected() != null)
                ? req.getAmountExpected()
                : occ.getAmountExpected();
        if (amount == null) amount = BigDecimal.ZERO; // hoặc bắt buộc > 0 tuỳ nghiệp vụ

        Transaction tx = postingPort.postFromRecurring(
                user,
                occ.getTemplate().getUserCategory(),
                amount,
                occ.getOccurrenceAt(),
                occ.getTemplate().getNote(),
                PaymentMethod.BANK,
                TransactionType.EXPENSE
        );

        occ.setPostedTransaction(tx);
        occ.setStatus(RecurringStatus.POSTED);
        occurrenceRepo.save(occ);

        LocalDateTime nextAt = computeNext(occ.getOccurrenceAt(), occ.getTemplate().getFrequency());
        if (occ.getTemplate().getEndAt() == null || !nextAt.isAfter(occ.getTemplate().getEndAt())) {
            if (!occurrenceRepo.existsByTemplateIdAndOccurrenceAt(occ.getTemplate().getId(), nextAt)) {
                RecurringOccurrence next = RecurringOccurrence.builder()
                        .template(occ.getTemplate())
                        .occurrenceAt(nextAt)
                        .status(RecurringStatus.PLANNED)
                        .build();
                occurrenceRepo.save(next);
            }
        }
        return tx;
    }

    @Transactional
    public void skipOccurrence(Long occurrenceId) {
        User user = SecurityUtils.getCurrentUser();

        RecurringOccurrence occ = occurrenceRepo.findById(occurrenceId)
                .orElseThrow(() -> new RuntimeException("Occurrence không tồn tại"));

        if (!occ.getTemplate().getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Occurrence không thuộc user");
        }
        if (occ.getStatus() != RecurringStatus.PLANNED && occ.getStatus() != RecurringStatus.REVIEW) {
            throw new RuntimeException("Chỉ skip khi PLANNED/REVIEW");
        }

        occ.setStatus(RecurringStatus.SKIPPED);
        occurrenceRepo.save(occ);

        LocalDateTime nextAt = computeNext(occ.getOccurrenceAt(), occ.getTemplate().getFrequency());
        if (occ.getTemplate().getEndAt() == null || !nextAt.isAfter(occ.getTemplate().getEndAt())) {
            if (!occurrenceRepo.existsByTemplateIdAndOccurrenceAt(occ.getTemplate().getId(), nextAt)) {
                RecurringOccurrence next = RecurringOccurrence.builder()
                        .template(occ.getTemplate())
                        .occurrenceAt(nextAt)
                        .status(RecurringStatus.PLANNED)
                        .build();
                occurrenceRepo.save(next);
            }
        }
    }

    @Transactional
    public void snoozeOccurrence(Long occurrenceId, int days) {
        User user = SecurityUtils.getCurrentUser();

        RecurringOccurrence occ = occurrenceRepo.findById(occurrenceId)
                .orElseThrow(() -> new RuntimeException("Occurrence không tồn tại"));

        if (!occ.getTemplate().getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Occurrence không thuộc user");
        }
        if (occ.getStatus() != RecurringStatus.PLANNED && occ.getStatus() != RecurringStatus.REVIEW) {
            throw new RuntimeException("Chỉ snooze khi PLANNED/REVIEW");
        }

        occ.setOccurrenceAt(occ.getOccurrenceAt().plusDays(days));
        occurrenceRepo.save(occ);
    }

    @Transactional
    public int autopayRun() {
        User user = SecurityUtils.getCurrentUser();
        List<RecurringOccurrence> dues = occurrenceRepo.findDueByUser(user, LocalDateTime.now());

        int posted = 0;
        for (RecurringOccurrence occ : dues) {
            RecurringTemplate tpl = occ.getTemplate();
            if (!tpl.isActive()) continue;
            if (occ.getPostedTransaction() != null) continue;

            if (tpl.isAutoPay() && occ.getAmountExpected() != null) {
                BigDecimal limit = tpl.getLimitAmount();
                if (limit == null || occ.getAmountExpected().compareTo(limit) <= 0) {
                    confirmOccurrence(occ.getId(), null);
                    posted++;
                    continue;
                }
            }
            if (occ.getStatus() == RecurringStatus.PLANNED) {
                occ.setStatus(RecurringStatus.REVIEW);
                occurrenceRepo.save(occ);
            }
        }
        return posted;
    }

    public static LocalDateTime computeNext(LocalDateTime from, RecurringFrequency freq) {
        switch (freq) {
            case DAILY:  return from.plusDays(1);
            case WEEKLY: return from.plusWeeks(1);
            case MONTHLY: {
                YearMonth ym = YearMonth.from(from).plusMonths(1);
                int day = Math.min(from.getDayOfMonth(), ym.lengthOfMonth());
                return from.withYear(ym.getYear()).withMonth(ym.getMonthValue()).withDayOfMonth(day);
            }
            case YEARLY: {
                int year = from.getYear() + 1;
                int month = from.getMonthValue();
                int day = Math.min(from.getDayOfMonth(), YearMonth.of(year, month).lengthOfMonth());
                return from.withYear(year).withMonth(month).withDayOfMonth(day);
            }
            default: throw new IllegalArgumentException("Unknown frequency: " + freq);
        }
    }
}
