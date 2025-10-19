// src/main/java/com/finance/transaction/repository/TransactionRepository.java
package com.finance.transaction.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.finance.auth.entity.User;
import com.finance.category.entity.CategoryType;
import com.finance.category.entity.UserCategory;
import com.finance.transaction.entity.PaymentMethod;
import com.finance.transaction.entity.Transaction;
import com.finance.transaction.entity.TransactionType;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

public interface TransactionRepository extends JpaRepository<Transaction, Long>, JpaSpecificationExecutor<Transaction> {

	// ===== Projections =====
	interface Kpis2 {
		BigDecimal getIncome();

		BigDecimal getExpense();
	}

	interface Kpis3 {
		BigDecimal getIncome();

		BigDecimal getExpense();

		BigDecimal getSaving();
	}

	interface LabelAmount {
		String getLabel();

		BigDecimal getAmount();
	}

	interface TimeseriesRow {
		String getBucketLabel();

		BigDecimal getIncome();

		BigDecimal getExpense();
	}

	// ===== CRUD & FILTER =====
	List<Transaction> findByUserId(Long userId);

	List<Transaction> findByUserIdAndTransactionDateBetween(Long userId, LocalDateTime start, LocalDateTime end);

	List<Transaction> findByUserIdAndType(Long userId, TransactionType type);

	List<Transaction> findByUserIdAndPaymentMethod(Long userId, PaymentMethod method);

	// Latest by User object
	List<Transaction> findTop10ByUserOrderByTransactionDateDesc(User user);

	// ===== KPI tháng (INCOME, EXPENSE) =====
	@Query(value = """
			SELECT
			  COALESCE(SUM(CASE WHEN t.type = 'INCOME'  THEN t.amount END), 0)::numeric  AS income,
			  COALESCE(SUM(CASE WHEN t.type = 'EXPENSE' THEN t.amount END), 0)::numeric  AS expense
			FROM transactions t
			WHERE t.user_id = :userId
			  AND EXTRACT(MONTH FROM t.transaction_date) = :month
			  AND EXTRACT(YEAR  FROM t.transaction_date) = :year
			""", nativeQuery = true)
	Kpis2 kpisByMonth(@Param("userId") Long userId, @Param("month") int month, @Param("year") int year);

	// ===== KPI tháng (thêm SAVING) cho dashboard cards =====
	@Query(value = """
			SELECT
			  COALESCE(SUM(CASE WHEN t.type = 'INCOME'  THEN t.amount END), 0)::numeric AS income,
			  COALESCE(SUM(CASE WHEN t.type = 'EXPENSE' THEN t.amount END), 0)::numeric AS expense,
			  COALESCE(SUM(CASE WHEN t.type = 'SAVING'  THEN t.amount END), 0)::numeric AS saving
			FROM transactions t
			WHERE t.user_id = :userId
			  AND EXTRACT(MONTH FROM t.transaction_date) = :month
			  AND EXTRACT(YEAR  FROM t.transaction_date)  = :year
			""", nativeQuery = true)
	Kpis3 kpisByMonth3(@Param("userId") Long userId, @Param("month") int month, @Param("year") int year);

	// ===== Timeseries DAILY =====
	@Query(value = """
			WITH series AS (
			  SELECT gs::date AS bucket
			  FROM generate_series(
			    CAST(:start AS date),
			    CAST(:end   AS date),
			    interval '1 day'
			  ) AS gs
			)
			SELECT
			  to_char(s.bucket, 'YYYY-MM-DD') AS bucketLabel,
			  COALESCE(SUM(CASE WHEN t.type='INCOME'  THEN t.amount END), 0) AS income,
			  COALESCE(SUM(CASE WHEN t.type='EXPENSE' THEN t.amount END), 0) AS expense
			FROM series s
			LEFT JOIN transactions t
			  ON t.user_id = :userId
			 AND t.transaction_date >= s.bucket::timestamp
			 AND t.transaction_date <  (s.bucket + interval '1 day')::timestamp
			GROUP BY s.bucket
			ORDER BY s.bucket
			""", nativeQuery = true)
	List<TimeseriesRow> timeseriesDaily(@Param("userId") Long userId, @Param("start") LocalDateTime start,
			@Param("end") LocalDateTime end);

	// ===== Timeseries WEEKLY (ISO week) =====
	@Query(value = """
			WITH series AS (
			  SELECT date_trunc('week', gs)::date AS bucket
			  FROM generate_series(
			    date_trunc('week', CAST(:start AS timestamp)),
			    date_trunc('week', CAST(:end   AS timestamp)),
			    interval '1 week'
			  ) AS gs
			)
			SELECT
			  to_char(s.bucket, 'IYYY-"W"IW') AS bucketLabel,
			  COALESCE(SUM(CASE WHEN t.type='INCOME'  THEN t.amount END), 0) AS income,
			  COALESCE(SUM(CASE WHEN t.type='EXPENSE' THEN t.amount END), 0) AS expense
			FROM series s
			LEFT JOIN transactions t
			  ON t.user_id = :userId
			 AND t.transaction_date >= s.bucket::timestamp
			 AND t.transaction_date <  (s.bucket + interval '1 week')::timestamp
			GROUP BY s.bucket
			ORDER BY s.bucket
			""", nativeQuery = true)
	List<TimeseriesRow> timeseriesWeekly(@Param("userId") Long userId, @Param("start") LocalDateTime start,
			@Param("end") LocalDateTime end);

	// ===== Timeseries MONTHLY =====
	@Query(value = """
			WITH series AS (
			  SELECT date_trunc('month', gs)::date AS bucket
			  FROM generate_series(
			    date_trunc('month', CAST(:start AS timestamp)),
			    date_trunc('month', CAST(:end   AS timestamp)),
			    interval '1 month'
			  ) AS gs
			)
			SELECT
			  to_char(s.bucket, 'YYYY-MM') AS bucketLabel,
			  COALESCE(SUM(CASE WHEN t.type='INCOME'  THEN t.amount END), 0) AS income,
			  COALESCE(SUM(CASE WHEN t.type='EXPENSE' THEN t.amount END), 0) AS expense
			FROM series s
			LEFT JOIN transactions t
			  ON t.user_id = :userId
			 AND t.transaction_date >= s.bucket::timestamp
			 AND t.transaction_date <  (s.bucket + interval '1 month')::timestamp
			GROUP BY s.bucket
			ORDER BY s.bucket
			""", nativeQuery = true)
	List<TimeseriesRow> timeseriesMonthly(@Param("userId") Long userId, @Param("start") LocalDateTime start,
			@Param("end") LocalDateTime end);

	// ===== Breakdown theo DANH MỤC =====
	@Query(value = """
			SELECT uc.name AS label,
			       COALESCE(SUM(t.amount), 0)::numeric AS amount
			FROM transactions t
			JOIN user_categories uc ON uc.id = t.user_category_id
			WHERE t.user_id = :userId
			  AND EXTRACT(MONTH FROM t.transaction_date) = :month
			  AND EXTRACT(YEAR  FROM t.transaction_date) = :year
			  AND t.type = :type
			GROUP BY uc.name
			ORDER BY amount DESC
			""", nativeQuery = true)
	List<LabelAmount> getCategoryBreakdownPg(@Param("userId") Long userId, @Param("month") int month,
			@Param("year") int year, @Param("type") String type);

	// ===== Breakdown theo PHƯƠNG THỨC =====
	@Query(value = """
			SELECT t.method AS label,
			       COALESCE(SUM(t.amount), 0)::numeric AS amount
			FROM transactions t
			WHERE t.user_id = :userId
			  AND EXTRACT(MONTH FROM t.transaction_date) = :month
			  AND EXTRACT(YEAR  FROM t.transaction_date) = :year
			  AND t.type = :type
			GROUP BY t.method
			ORDER BY amount DESC
			""", nativeQuery = true)
	List<LabelAmount> getPaymentMethodBreakdownPg(@Param("userId") Long userId, @Param("month") int month,
			@Param("year") int year, @Param("type") String type);

	// ===== Idempotency check =====
	boolean existsByUserAndTransactionDateAndAmountAndTypeAndPaymentMethodAndUserCategory(User user,
			LocalDateTime transactionDate, BigDecimal amount, TransactionType type, PaymentMethod paymentMethod,
			UserCategory userCategory);

	/**
	 * transaction để tính tổng tiền tiết kiệm theo thời gian. * percent]
	 */

	@Query("""
			    SELECT
			        TO_CHAR(t.transactionDate, 'YYYY-MM') AS month,
			        COALESCE(SUM(t.amount), 0)
			    FROM Transaction t
			    WHERE t.user.id = :userId AND t.type = 'SAVING'
			    GROUP BY TO_CHAR(t.transactionDate, 'YYYY-MM')
			    ORDER BY month
			""")
	List<Object[]> getSavingTrendByMonth(@Param("userId") Long userId);

	@Query("""
			    SELECT
			        TO_CHAR(t.transactionDate, 'IYYY-"W"IW') AS week,
			        COALESCE(SUM(t.amount), 0)
			    FROM Transaction t
			    WHERE t.user.id = :userId AND t.type = 'SAVING'
			    GROUP BY TO_CHAR(t.transactionDate, 'IYYY-"W"IW')
			    ORDER BY week
			""")
	List<Object[]> getSavingTrendByWeek(@Param("userId") Long userId);

	@Query("""
			    SELECT COALESCE(SUM(t.amount), 0)
			    FROM Transaction t
			    WHERE t.user.id = :userId AND t.type = :type
			""")
	BigDecimal sumAmountByUserAndType(Long userId, TransactionType type);

	@Query("""
			    SELECT t.userCategory.name, COALESCE(SUM(t.amount), 0)
			    FROM Transaction t
			    WHERE t.userCategory.masterCategory.type = :type
			      AND t.userCategory.user.id = :userId
			      AND EXTRACT(MONTH FROM t.transactionDate) = :month
			      AND EXTRACT(YEAR FROM t.transactionDate) = :year
			    GROUP BY t.userCategory.name
			""")
	List<Object[]> sumByCategoryForUserAndMonth(@Param("type") CategoryType type, @Param("userId") Long userId,
			@Param("month") int month, @Param("year") int year);

}
