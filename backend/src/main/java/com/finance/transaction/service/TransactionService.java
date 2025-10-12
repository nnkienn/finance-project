// src/main/java/com/finance/transaction/service/TransactionService.java
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

    // ================== CRUD ==================

    @Transactional
    public TransactionResponse createTransaction(TransactionRequest request) {
        User user = SecurityUtils.getCurrentUser();
        if (request.getType() == TransactionType.SAVING) {
            if (request.getSavingGoalId() == null) {
                throw new RuntimeException("savingGoalId is required for SAVING transactions");
            }
        }
        
        UserCategory userCategory = null;
        if (request.getType() != TransactionType.SAVING) {
            // only resolve category for non-saving types (optional rule)
            userCategory = userCategoryRepository
                .findByIdAndUserId(request.getUserCategoryId(), user.getId())
                .orElseThrow(() -> new RuntimeException(
                    "UserCategory không thuộc user (id=" + request.getUserCategoryId() + ")"));
        }

        Transaction tx = new Transaction();
        tx.setAmount(request.getAmount());
        tx.setType(request.getType());
        tx.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : PaymentMethod.CASH);
        tx.setNote(request.getNote());
        tx.setTransactionDate(request.getTransactionDate() != null ? request.getTransactionDate() : LocalDateTime.now());
        tx.setUser(user);
        if (userCategory != null) tx.setUserCategory(userCategory);
        if(tx.getType() == TransactionType.SAVING && request.getSavingGoalId() !=null) {
        	SavingGoal goal = savingGoalService.requireOwnedGoal(request.getSavingGoalId());
        	tx.setSavingGoal(goal);
        }
        
        
        tx = transactionRepository.save(tx);
        
        if (tx.getType() == TransactionType.SAVING) {
            savingGoalService.updateProgressFromTransaction(tx);
        }


        transactionEventPublisher.publish(new TransactionEventDTO(
            tx.getId(), user.getId(), tx.getAmount(),
            tx.getType().name(), tx.getPaymentMethod().name(), tx.getTransactionDate()
        ));

        return TransactionMapper.toResponse(tx);
    }

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

    @Transactional
    public TransactionResponse updateTransaction(Long id, TransactionRequest request) {
        User user = SecurityUtils.getCurrentUser();

        Transaction tx = transactionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Transaction not found with id " + id));

        // Lưu trạng thái cũ để xử lý rollback/adjust
        TransactionType oldType = tx.getType();
        java.math.BigDecimal oldAmount = tx.getAmount();
        SavingGoal oldGoal = tx.getSavingGoal();

        // --- Update category nếu thay đổi (nếu vẫn dùng) ---
        if (request.getUserCategoryId() != null) {
            if (tx.getUserCategory() == null || !request.getUserCategoryId().equals(tx.getUserCategory().getId())) {
                UserCategory newCat = userCategoryRepository
                    .findByIdAndUserId(request.getUserCategoryId(), user.getId())
                    .orElseThrow(() -> new RuntimeException(
                        "UserCategory không thuộc user (id=" + request.getUserCategoryId() + ")"));
                tx.setUserCategory(newCat);
            }
        }

        // --- Apply basic fields ---
        tx.setAmount(request.getAmount());
        tx.setType(request.getType());
        tx.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : tx.getPaymentMethod());
        tx.setNote(request.getNote());
        tx.setTransactionDate(request.getTransactionDate() != null ? request.getTransactionDate() : tx.getTransactionDate());

        // --- Handle saving logic (4 cases) ---
        TransactionType newType = request.getType();
        java.math.BigDecimal newAmount = request.getAmount() == null ? java.math.BigDecimal.ZERO : request.getAmount();

        if (oldType == TransactionType.SAVING && newType == TransactionType.SAVING) {
            // SAVING -> SAVING (maybe same goal or moved to another goal or amount changed)
            Long newGoalId = request.getSavingGoalId();
            if (newGoalId == null) {
                throw new RuntimeException("savingGoalId is required for SAVING transactions");
            }
            SavingGoal newGoal = savingGoalService.requireOwnedGoal(newGoalId);

            if (oldGoal != null && !oldGoal.getId().equals(newGoal.getId())) {
                // moved from oldGoal -> newGoal: subtract old amount from oldGoal, add new amount to newGoal
                savingGoalService.adjustAmountForUpdate(oldGoal, oldAmount.negate(), "Revert due to transaction update");
                savingGoalService.adjustAmountForUpdate(newGoal, newAmount, "Deposit due to transaction update");
            } else {
                // same goal: apply diff
                java.math.BigDecimal diff = newAmount.subtract(oldAmount);
                if (diff.signum() != 0) {
                    savingGoalService.adjustAmountForUpdate(newGoal, diff, "Adjust due to transaction update");
                }
            }
            tx.setSavingGoal(newGoal);
        } else if (oldType == TransactionType.SAVING && newType != TransactionType.SAVING) {
            // SAVING -> NON-SAVING: remove old amount from the old goal
            if (oldGoal != null) {
                savingGoalService.adjustAmountForUpdate(oldGoal, oldAmount.negate(), "Revert due to transaction update (to non-saving)");
            }
            tx.setSavingGoal(null);

            // ensure category exists for non-saving types (optional)
            if (request.getUserCategoryId() != null) {
                UserCategory newCat = userCategoryRepository
                    .findByIdAndUserId(request.getUserCategoryId(), user.getId())
                    .orElseThrow(() -> new RuntimeException("UserCategory không thuộc user (id=" + request.getUserCategoryId() + ")"));
                tx.setUserCategory(newCat);
            }
        } else if (oldType != TransactionType.SAVING && newType == TransactionType.SAVING) {
            // NON-SAVING -> SAVING: add new amount to the new goal
            Long newGoalId = request.getSavingGoalId();
            if (newGoalId == null) {
                throw new RuntimeException("savingGoalId is required for SAVING transactions");
            }
            SavingGoal newGoal = savingGoalService.requireOwnedGoal(newGoalId);
            savingGoalService.adjustAmountForUpdate(newGoal, newAmount, "Deposit due to transaction update (to saving)");
            tx.setSavingGoal(newGoal);
        } else {
            // NON-SAVING -> NON-SAVING: nothing to do with saving goals
            tx.setSavingGoal(null);
        }

        tx = transactionRepository.save(tx);
        return TransactionMapper.toResponse(tx);
    }


    @Transactional
    public void deleteTransaction(Long id) {
        Transaction tx = transactionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Transaction not found with id " + id));

        if (tx.getType() == TransactionType.SAVING && tx.getSavingGoal() != null) {
            // subtract this tx.amount from goal
            savingGoalService.adjustAmountForUpdate(tx.getSavingGoal(), tx.getAmount().negate(), "Revert due to transaction delete");
        }

        transactionRepository.deleteById(id);
    }


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
