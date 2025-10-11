package com.finance.saving.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.finance.saving.entity.SavingGoal;
import com.finance.saving.entity.SavingGoalStatus;

@Repository
public interface SavingGoalRepository extends JpaRepository<SavingGoal, Long> {

	/**
	 * Lấy tất cả mục tiêu của user (vd: dashboard “My Goals”)
	 */
	List<SavingGoal> findByUserIdOrderByCreatedAtDesc(Long userId);

	/**
	 * Lấy mục tiêu theo user + id (đảm bảo user chỉ truy cập được mục tiêu của
	 * mình)
	 */
	Optional<SavingGoal> findByIdAndUserId(Long id, Long userId);

	/**
	 * Lấy các goal đang hoạt động (chưa hoàn thành / chưa huỷ)
	 */
	List<SavingGoal> findByUserIdAndStatusIn(Long userId, List<SavingGoalStatus> statuses);

	/**
	 * Tính tổng số tiền đã tiết kiệm được của 1 user (sum all goals)
	 */
	@Query("""
			    SELECT COALESCE(SUM(g.currentAmount), 0)
			    FROM SavingGoal g
			    WHERE g.user.id = :userId
			""")
	BigDecimal getTotalSavedByUser(@Param("userId") Long userId);

	/**
	 * Tính tiến độ cho từng goal (%) Dữ liệu dạng [goalId, name, current, target,
	 * percent]
	 */
	@Query("""
			    SELECT g.id,
			           g.name,
			           g.currentAmount,
			           g.targetAmount,
			           CASE
			               WHEN g.targetAmount = 0 THEN 0
			               ELSE ROUND((g.currentAmount / g.targetAmount) * 100, 2)
			           END AS progress
			    FROM SavingGoal g
			    WHERE g.user.id = :userId
			""")
	List<Object[]> getGoalProgressByUser(@Param("userId") Long userId);

	long countByUserIdAndStatus(Long userId, com.finance.saving.entity.SavingGoalStatus status);

	boolean existsByIdAndUserId(Long id, Long userId);

	

}