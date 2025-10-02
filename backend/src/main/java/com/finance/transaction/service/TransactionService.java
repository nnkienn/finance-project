package com.finance.transaction.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.finance.auth.entity.User;
import com.finance.auth.util.SecurityUtils;
import com.finance.category.entity.UserCategory;
import com.finance.category.repository.UserCategoryRepository;
import com.finance.kafka.dto.TransactionEventDTO;
import com.finance.kafka.producer.TransactionEventPublisher;
import com.finance.transaction.dto.TransactionMapper;
import com.finance.transaction.dto.TransactionRequest;
import com.finance.transaction.dto.TransactionResponse;
import com.finance.transaction.entity.PaymentMethod;
import com.finance.transaction.entity.Transaction;
import com.finance.transaction.entity.TransactionSpecification;
import com.finance.transaction.entity.TransactionType;
import com.finance.transaction.port.RecurringPostingPort;
import com.finance.transaction.repository.TransactionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransactionService implements RecurringPostingPort {

    private final TransactionRepository transactionRepository;
    private final UserCategoryRepository userCategoryRepository;
    private final TransactionEventPublisher transactionEventPublisher;


    // ================== CRUD ==================

    @Transactional
    public TransactionResponse createTransaction(TransactionRequest request) {
        User user = SecurityUtils.getCurrentUser();

        // Bảo vệ: category phải thuộc đúng user
        UserCategory userCategory = userCategoryRepository
                .findByIdAndUserId(request.getUserCategoryId(), user.getId())
                .orElseThrow(() -> new RuntimeException(
                        "UserCategory không thuộc user (id=" + request.getUserCategoryId() + ")"));

        Transaction transaction = new Transaction();
        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setPaymentMethod(
                request.getPaymentMethod() != null ? request.getPaymentMethod() : PaymentMethod.CASH
        );
        transaction.setNote(request.getNote());
        transaction.setTransactionDate(
                request.getTransactionDate() != null ? request.getTransactionDate() : LocalDateTime.now()
        );
        transaction.setUser(user);
        transaction.setUserCategory(userCategory);

        transactionEventPublisher.publish(new TransactionEventDTO(
        		transaction.getId(),
                user.getId(),
                transaction.getAmount(),
                transaction.getType().name(),
                transaction.getPaymentMethod().name(),
                transaction.getTransactionDate()
        ));
        
        return TransactionMapper.toResponse(transactionRepository.save(transaction));
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
                .collect(Collectors.toList());
    }

    @Transactional
    public TransactionResponse updateTransaction(Long id, TransactionRequest request) {
        User user = SecurityUtils.getCurrentUser();

        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id " + id));

        // Nếu người dùng đổi category, đảm bảo category mới thuộc user hiện tại
        if (request.getUserCategoryId() != null
                && (transaction.getUserCategory() == null
                    || !request.getUserCategoryId().equals(transaction.getUserCategory().getId()))) {
            UserCategory newCat = userCategoryRepository
                    .findByIdAndUserId(request.getUserCategoryId(), user.getId())
                    .orElseThrow(() -> new RuntimeException(
                            "UserCategory không thuộc user (id=" + request.getUserCategoryId() + ")"));
            transaction.setUserCategory(newCat);
        }

        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setPaymentMethod(
                request.getPaymentMethod() != null ? request.getPaymentMethod() : transaction.getPaymentMethod()
        );
        transaction.setNote(request.getNote());
        transaction.setTransactionDate(
                request.getTransactionDate() != null ? request.getTransactionDate() : transaction.getTransactionDate()
        );

        // KHÔNG còn set các field recurring (đã bỏ)

        return TransactionMapper.toResponse(transactionRepository.save(transaction));
    }

    @Transactional
    public void deleteTransaction(Long id) {
        if (!transactionRepository.existsById(id)) {
            throw new RuntimeException("Transaction not found with id " + id);
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
        ).stream().map(TransactionMapper::toResponse).collect(Collectors.toList());
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
        return transactionRepository.findTop5ByUserOrderByTransactionDateDesc(user)
                .stream().limit(limit)
                .map(TransactionMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Map<String, BigDecimal> getMonthlySummary(int month, int year) {
        User user = SecurityUtils.getCurrentUser();
        Map<String, BigDecimal> summary = new HashMap<>();
        for (Object[] row : transactionRepository.getMonthlySummary(user, month, year)) {
            summary.put(((TransactionType) row[0]).name(), (BigDecimal) row[1]);
        }
        return summary;
    }

    @Transactional(readOnly = true)
    public Map<String, BigDecimal> getCategoryBreakdown(int month, int year) {
        User user = SecurityUtils.getCurrentUser();
        Map<String, BigDecimal> breakdown = new HashMap<>();
        for (Object[] row : transactionRepository.getCategoryBreakdown(user, month, year)) {
            breakdown.put((String) row[0], (BigDecimal) row[1]);
        }
        return breakdown;
    }

    @Transactional(readOnly = true)
    public Map<String, BigDecimal> getPaymentMethodBreakdown(int month, int year) {
        User user = SecurityUtils.getCurrentUser();
        Map<String, BigDecimal> breakdown = new HashMap<>();
        for (Object[] row : transactionRepository.getPaymentMethodBreakdown(user, month, year)) {
            breakdown.put(((PaymentMethod) row[0]).name(), (BigDecimal) row[1]);
        }
        return breakdown;
    }

	@Override
	@Transactional
	public Transaction postFromRecurring(User user, UserCategory category, BigDecimal amount, LocalDateTime when,
			String note, PaymentMethod method, TransactionType type) {
		 Transaction tx = new Transaction();
		    tx.setUser(user);
		    tx.setUserCategory(category);
		    tx.setAmount(amount);
		    tx.setType(type != null ? type : TransactionType.EXPENSE); // mặc định chi
		    tx.setPaymentMethod(method != null ? method : PaymentMethod.BANK);
		    tx.setNote(note);
		    tx.setTransactionDate(when);

		    return transactionRepository.save(tx);
	}
}
