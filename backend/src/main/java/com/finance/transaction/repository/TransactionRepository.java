package com.finance.transaction.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.finance.transaction.entity.PaymentMethod;
import com.finance.transaction.entity.Transaction;
import com.finance.transaction.entity.TransactionType;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

	// Pharse 1: CRUD & FILTER
	List<Transaction> findByUserId(Long userId);

	List<Transaction> findByUserIdAndTransactionDateBetween(Long userId, LocalDateTime start, LocalDateTime end);

	List<Transaction> findByUserIdAndType(Long userId, TransactionType type);

	List<Transaction> findByUserIdAndPaymentMethod(Long userId, PaymentMethod method);

	List<Transaction> findTop5ByUserIdOrderByTransactionDateDesc(Long userId);

	// Pharse 2 : Analystics

	@Query("SELECT COALESCE(SUM(t.amount),0) FROM Transaction t " + "WHERE t.user.id = :userId AND t.type = :type "
			+ "AND t.transactionDate BETWEEN :start AND :end")
	BigDecimal sumAmountByUserAndTypeAndDateRange(Long userId, TransactionType type, LocalDateTime start,
			LocalDateTime end);

	@Query("SELECT t.userCategory.name, SUM(t.amount) " + "FROM Transaction t "
			+ "WHERE t.user.id = :userId AND t.transactionDate BETWEEN :start AND :end "
			+ "GROUP BY t.userCategory.name")
	List<Object[]> getCategoryBreakdown(Long userId, LocalDateTime start, LocalDateTime end);
	
	 // Breakdown theo payment method
    @Query("SELECT t.paymentMethod, SUM(t.amount) " +
           "FROM Transaction t " +
           "WHERE t.user.id = :userId AND t.transactionDate BETWEEN :start AND :end " +
           "GROUP BY t.paymentMethod")
    List<Object[]> getPaymentMethodBreakdown(Long userId, LocalDateTime start, LocalDateTime end);
    
	// Pharse 3: Recuring
    
    // Lấy các transaction recurring đang active
    List<Transaction> findByUserIdAndRecurringTrueAndActiveRecurringTrue(Long userId);
    
    // Lấy các transaction recurring cần chạy (nextRunTime <= now)
    List<Transaction> findByRecurringTrueAndActiveRecurringTrueAndNextRunTimeBefore(LocalDateTime now);

   // Pharse 4: Export csv
    // Lấy danh sách transaction trong khoảng thời gian (dùng cho export CSV/PDF)
    List<Transaction> findByUserIdAndTransactionDateBetweenOrderByTransactionDateDesc(
            Long userId,
            LocalDateTime start,
            LocalDateTime end
    );
    

}
