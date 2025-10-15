package com.finance.transaction.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.finance.auth.entity.User;
import com.finance.auth.util.SecurityUtils;
import com.finance.category.entity.UserCategory;
import com.finance.category.repository.UserCategoryRepository;
import com.finance.kafka.dto.TransactionEventDTO;
import com.finance.kafka.producer.TransactionEventPublisher;
import com.finance.outbox.service.OutboxService;
import com.finance.saving.entity.SavingGoal;
import com.finance.saving.service.SavingGoalService;
import com.finance.transaction.dto.MonthlyCardsResponse;
import com.finance.transaction.dto.TimeseriesPoint;
import com.finance.transaction.dto.TimeseriesResponse;
import com.finance.transaction.dto.TransactionMapper;
import com.finance.transaction.dto.TransactionRequest;
import com.finance.transaction.dto.TransactionResponse;
import com.finance.transaction.entity.PaymentMethod;
import com.finance.transaction.entity.Transaction;
import com.finance.transaction.entity.TransactionSpecification;
import com.finance.transaction.entity.TransactionType;
import com.finance.transaction.port.RecurringPostingPort;
import com.finance.transaction.repository.TransactionRepository;
import com.finance.transaction.repository.TransactionRepository.Kpis2;
import com.finance.transaction.repository.TransactionRepository.Kpis3;
import com.finance.transaction.repository.TransactionRepository.LabelAmount;
import com.finance.transaction.repository.TransactionRepository.TimeseriesRow;

@Service
@RequiredArgsConstructor
public class TransactionService implements RecurringPostingPort {

    private final TransactionRepository transactionRepository;
    private final UserCategoryRepository userCategoryRepository;
    private final TransactionEventPublisher transactionEventPublisher;
    private final SavingGoalService savingGoalService;
    private final OutboxService outboxService;
    
    // ================== CREATE ==================

    /**
     * Tạo transaction mới — đồng thời publish Kafka event (transaction.created)
     */
    @Transactional
    public TransactionResponse createTransaction(TransactionRequest request) {
        User user = SecurityUtils.getCurrentUser();

        if (request.getType() == TransactionType.SAVING && request.getSavingGoalId() == null) {
            throw new RuntimeException("savingGoalId is required for SAVING transactions");
        }

        UserCategory userCategory = null;
        if (request.getType() != TransactionType.SAVING && request.getUserCategoryId() != null) {
            userCategory = userCategoryRepository
                .findByIdAndUserId(request.getUserCategoryId(), user.getId())
                .orElseThrow(() ->
                    new RuntimeException("UserCategory không thuộc user (id=" + request.getUserCategoryId() + ")"));
        }

        Transaction tx = new Transaction();
        tx.setAmount(request.getAmount());
        tx.setType(request.getType());
        tx.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : PaymentMethod.CASH);
        tx.setNote(request.getNote());
        tx.setTransactionDate(request.getTransactionDate() != null ? request.getTransactionDate() : LocalDateTime.now());
        tx.setUser(user);
        if (userCategory != null) tx.setUserCategory(userCategory);

        // Nếu là SAVING -> liên kết goal
        if (tx.getType() == TransactionType.SAVING && request.getSavingGoalId() != null) {
            SavingGoal goal = savingGoalService.requireOwnedGoal(request.getSavingGoalId());
            tx.setSavingGoal(goal);
        }

        // Lưu DB
        tx = transactionRepository.save(tx);

        // Nếu là giao dịch tiết kiệm, cập nhật tiến độ goal
        if (tx.getType() == TransactionType.SAVING) {
            savingGoalService.updateProgressFromTransaction(tx);
        }

        // 📨 Gửi event qua Kafka (transaction.created)
        try {
        	var dto = TransactionEventDTO.builder()
        		    .transactionId(tx.getId())
        		    .userId(tx.getUser().getId())
        		    .type(tx.getType().name())
        		    .method(tx.getPaymentMethod().name())   // CHÚ Ý: entity là paymentMethod
        		    .amount(tx.getAmount())
        		    .transactionDate(tx.getTransactionDate())
        		    .note(tx.getNote())
        		    .userCategoryId(tx.getUserCategory() != null ? tx.getUserCategory().getId() : null)
        		    .savingGoalId(tx.getSavingGoal() != null ? tx.getSavingGoal().getId() : null)
        		    .build();

        		outboxService.saveEvent(
        		    "Transaction",
        		    String.valueOf(tx.getId()),
        		    "transaction.created",   // tên topic
        		    dto
        		);


        } catch (Exception e) {
            System.err.println("⚠️ Kafka publish failed: " + e.getMessage());
            // Không throw để không rollback DB nếu Kafka lỗi
        }

        return TransactionMapper.toResponse(tx);
    }

    // ================== READ ==================

    @Transactional(readOnly = true)
    public TransactionResponse getTransactionById(Long id) {
        Transaction transaction = transactionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Transaction not found with id " + id));
        return TransactionMapper.toResponse(transaction);
    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> getUserTransactions() {
        User user = SecurityUtils.getCurrentUser();
        return transactionRepository.findByUserId(user.getId()).stream()
            .map(TransactionMapper::toResponse)
            .toList();
    }

    // ================== UPDATE ==================
    @Transactional
    public TransactionResponse updateTransaction(Long id, TransactionRequest request) {
        User user = SecurityUtils.getCurrentUser();

        Transaction tx = transactionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Transaction not found with id " + id));

        TransactionType oldType = tx.getType();
        BigDecimal oldAmount = tx.getAmount();
        SavingGoal oldGoal = tx.getSavingGoal();

        // Cập nhật cơ bản
        tx.setAmount(request.getAmount());
        tx.setType(request.getType());
        tx.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : tx.getPaymentMethod());
        tx.setNote(request.getNote());
        tx.setTransactionDate(request.getTransactionDate() != null ? request.getTransactionDate() : tx.getTransactionDate());

        // Cập nhật goal logic (4 case)
        savingGoalService.handleTransactionGoalUpdate(user, tx, oldType, oldGoal, oldAmount, request);

        
        tx = transactionRepository.save(tx);
        return TransactionMapper.toResponse(tx);
    }

    // ================== DELETE ==================
    @Transactional
    public void deleteTransaction(Long id) {
        Transaction tx = transactionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Transaction not found with id " + id));

        if (tx.getType() == TransactionType.SAVING && tx.getSavingGoal() != null) {
            savingGoalService.adjustAmountForUpdate(tx.getSavingGoal(), tx.getAmount().negate(), "Revert due to transaction delete");
        }

        transactionRepository.deleteById(id);
    }

    // ================== FILTER & ANALYTICS ==================
    // (giữ nguyên toàn bộ các hàm KPI, Breakdown, Timeseries của bạn)


    // ================== FILTER & ANALYTICS ==================

    @Transactional(readOnly = true)
    public List<TransactionResponse> getTransactionsFiltered(LocalDateTime startDate,
                                                             LocalDateTime endDate,
                                                             TransactionType type,
                                                             Long categoryId,
                                                             PaymentMethod paymentMethod) {
        User user = SecurityUtils.getCurrentUser();
        UserCategory category = null;

        if (categoryId != null) {
            category = userCategoryRepository.findByIdAndUserId(categoryId, user.getId())
                .orElseThrow(() -> new RuntimeException("Category không thuộc user"));
        }

        return transactionRepository.findAll(
                TransactionSpecification.withFilters(user, startDate, endDate, type, category, paymentMethod)
        ).stream().map(TransactionMapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public Page<TransactionResponse> getTransactionsFilteredPaged(LocalDateTime startDate,
                                                                  LocalDateTime endDate,
                                                                  TransactionType type,
                                                                  Long categoryId,
                                                                  PaymentMethod paymentMethod,
                                                                  Pageable pageable) {
        User user = SecurityUtils.getCurrentUser();
        UserCategory category = null;

        if (categoryId != null) {
            category = userCategoryRepository.findByIdAndUserId(categoryId, user.getId())
                .orElseThrow(() -> new RuntimeException("Category không thuộc user"));
        }

        return transactionRepository.findAll(
            TransactionSpecification.withFilters(user, startDate, endDate, type, category, paymentMethod),
            pageable
        ).map(TransactionMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> getLatestTransactions(int limit) {
        User user = SecurityUtils.getCurrentUser();
        return transactionRepository.findTop10ByUserOrderByTransactionDateDesc(user)
            .stream().limit(limit)
            .map(TransactionMapper::toResponse)
            .toList();
    }

    /**
     * KPI theo tháng: INCOME, EXPENSE, NET (projection Kpis2)
     */
    @Transactional(readOnly = true)
    public Map<String, BigDecimal> getMonthlySummary(int month, int year) {
        User user = SecurityUtils.getCurrentUser();
        Kpis2 r = transactionRepository.kpisByMonth(user.getId(), month, year);

        BigDecimal income  = (r != null && r.getIncome()  != null) ? r.getIncome()  : BigDecimal.ZERO;
        BigDecimal expense = (r != null && r.getExpense() != null) ? r.getExpense() : BigDecimal.ZERO;
        BigDecimal net     = income.subtract(expense);

        Map<String, BigDecimal> out = new HashMap<>();
        out.put("INCOME",  income);
        out.put("EXPENSE", expense);
        out.put("NET",     net);
        return out;
    }

    @Transactional(readOnly = true)
    public Map<String, BigDecimal> getCategoryBreakdown(int month, int year, TransactionType type) {
        User user = SecurityUtils.getCurrentUser();
        Map<String, BigDecimal> res = new HashMap<>();
        List<LabelAmount> rows = transactionRepository.getCategoryBreakdownPg(user.getId(), month, year, type.name());
        for (LabelAmount r : rows) {
            res.put(r.getLabel(), r.getAmount() == null ? BigDecimal.ZERO : r.getAmount());
        }
        return res;
    }

    @Transactional(readOnly = true)
    public Map<String, BigDecimal> getPaymentMethodBreakdown(int month, int year, TransactionType type) {
        User user = SecurityUtils.getCurrentUser();
        Map<String, BigDecimal> res = new HashMap<>();
        List<LabelAmount> rows = transactionRepository.getPaymentMethodBreakdownPg(user.getId(), month, year, type.name());
        for (LabelAmount r : rows) {
            res.put(r.getLabel(), r.getAmount() == null ? BigDecimal.ZERO : r.getAmount());
        }
        return res;
    }

    @Transactional(readOnly = true)
    public MonthlyCardsResponse getMonthlyCards(int month, int year) {
        User user = SecurityUtils.getCurrentUser();

        Kpis3 cur = transactionRepository.kpisByMonth3(user.getId(), month, year);
        BigDecimal income  = (cur != null && cur.getIncome()  != null) ? cur.getIncome()  : BigDecimal.ZERO;
        BigDecimal expense = (cur != null && cur.getExpense() != null) ? cur.getExpense() : BigDecimal.ZERO;
        BigDecimal saving  = (cur != null && cur.getSaving()  != null) ? cur.getSaving()  : BigDecimal.ZERO;

        boolean savingAsOutflow = true;
        BigDecimal myBalance = savingAsOutflow
            ? income.subtract(expense).subtract(saving)
            : income.subtract(expense);

        int prevMonth = month == 1 ? 12 : month - 1;
        int prevYear  = month == 1 ? year - 1 : year;
        Kpis3 prev = transactionRepository.kpisByMonth3(user.getId(), prevMonth, prevYear);
        BigDecimal pIncome  = (prev != null && prev.getIncome()  != null) ? prev.getIncome()  : BigDecimal.ZERO;
        BigDecimal pExpense = (prev != null && prev.getExpense() != null) ? prev.getExpense() : BigDecimal.ZERO;
        BigDecimal pSaving  = (prev != null && prev.getSaving()  != null) ? prev.getSaving()  : BigDecimal.ZERO;

        java.util.function.BiFunction<BigDecimal, BigDecimal, BigDecimal> pct =
            (curV, prevV) -> (prevV.signum() == 0)
                ? BigDecimal.ZERO
                : curV.subtract(prevV).multiply(BigDecimal.valueOf(100))
                      .divide(prevV, 2, java.math.RoundingMode.HALF_UP);

        return new MonthlyCardsResponse(
            myBalance, income, saving, expense,
            pct.apply(income,  pIncome),
            pct.apply(saving,  pSaving),
            pct.apply(expense, pExpense)
        );
    }

    @Transactional(readOnly = true)
    public TimeseriesResponse getTimeseries(LocalDateTime start,
                                            LocalDateTime end,
                                            String granularity,
                                            String scope) {
        User user = SecurityUtils.getCurrentUser();

        List<TimeseriesRow> rows = switch ((granularity == null ? "DAILY" : granularity).toUpperCase()) {
            case "WEEKLY"  -> transactionRepository.timeseriesWeekly(user.getId(), start, end);
            case "MONTHLY" -> transactionRepository.timeseriesMonthly(user.getId(), start, end);
            default        -> transactionRepository.timeseriesDaily(user.getId(), start, end);
        };

        var points = rows.stream().map(r -> {
            String bucket      = r.getBucketLabel();
            BigDecimal income  = r.getIncome()  == null ? BigDecimal.ZERO : r.getIncome();
            BigDecimal expense = r.getExpense() == null ? BigDecimal.ZERO : r.getExpense();
            return new TimeseriesPoint(bucket, income, expense, income.subtract(expense));
        }).toList();

        if (scope != null && !"ALL".equalsIgnoreCase(scope)) {
            points = points.stream().map(p -> switch (scope.toUpperCase()) {
                case "INCOME"  -> new TimeseriesPoint(p.date(), p.income(), BigDecimal.ZERO, p.income());
                case "EXPENSE" -> new TimeseriesPoint(p.date(), BigDecimal.ZERO, p.expense(), p.expense().negate());
                default -> p;
            }).toList();
        }

        return new TimeseriesResponse(points);
    }

    // ================ Recurring posting port ================

    @Override
    @Transactional
    public Transaction postFromRecurring(User user, UserCategory category, BigDecimal amount, LocalDateTime when,
                                         String note, PaymentMethod method, TransactionType type) {
        Transaction tx = new Transaction();
        tx.setUser(user);
        tx.setUserCategory(category);
        tx.setAmount(amount);
        tx.setType(type != null ? type : TransactionType.EXPENSE);
        tx.setPaymentMethod(method != null ? method : PaymentMethod.BANK);
        tx.setNote(note);
        tx.setTransactionDate(when);
        return transactionRepository.save(tx);
    }
}
