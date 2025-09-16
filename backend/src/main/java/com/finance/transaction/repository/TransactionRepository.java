package com.finance.transaction.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.finance.auth.entity.User;
import com.finance.category.entity.UserCategory;
import com.finance.transaction.entity.PaymentMethod;
import com.finance.transaction.entity.Transaction;
import com.finance.transaction.entity.TransactionType;

public interface TransactionRepository extends JpaRepository<Transaction, Long> , JpaSpecificationExecutor<Transaction> {

	// Pharse 1: CRUD & FILTER
	List<Transaction> findByUserId(Long userId);

	List<Transaction> findByUserIdAndTransactionDateBetween(Long userId, LocalDateTime start, LocalDateTime end);

	List<Transaction> findByUserIdAndType(Long userId, TransactionType type);

	List<Transaction> findByUserIdAndPaymentMethod(Long userId, PaymentMethod method);

	List<Transaction> findTop5ByUserIdOrderByTransactionDateDesc(Long userId);

	// Pharse 2 : Analystics

    // 2. Latest transactions
    List<Transaction> findTop5ByUserOrderByTransactionDateDesc(User user);

    @Query("SELECT t.type, SUM(t.amount) FROM Transaction t " +
            "WHERE t.user = :user " +
            "AND MONTH(t.transactionDate) = :month " +
            "AND YEAR(t.transactionDate) = :year " +
            "GROUP BY t.type")
     List<Object[]> getMonthlySummary(
             @Param("user") User user,
             @Param("month") int month,
             @Param("year") int year
     );
     
     @Query("SELECT t.userCategory.name, SUM(t.amount) FROM Transaction t " +
             "WHERE t.user = :user " +
             "AND t.type = com.finance.transaction.entity.TransactionType.EXPENSE " +
             "AND MONTH(t.transactionDate) = :month " +
             "AND YEAR(t.transactionDate) = :year " +
             "GROUP BY t.userCategory.name")
      List<Object[]> getCategoryBreakdown(
              @Param("user") User user,
              @Param("month") int month,
              @Param("year") int year
      );

      // 5. Payment method breakdown
      @Query("SELECT t.paymentMethod, SUM(t.amount) FROM Transaction t " +
             "WHERE t.user = :user " +
             "AND MONTH(t.transactionDate) = :month " +
             "AND YEAR(t.transactionDate) = :year " +
             "GROUP BY t.paymentMethod")
      List<Object[]> getPaymentMethodBreakdown(
              @Param("user") User user,
              @Param("month") int month,
              @Param("year") int year
      );

    

}
