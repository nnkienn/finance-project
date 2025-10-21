package com.finance.saving.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.finance.auth.entity.User;
import com.finance.auth.util.SecurityUtils;
import com.finance.saving.dto.SavingGoalSummaryDto;
import com.finance.saving.dto.SavingMonthlyReportDto;
import com.finance.saving.entity.SavingGoal;
import com.finance.saving.entity.SavingGoalStatus;
import com.finance.saving.repository.SavingGoalRepository;
import com.finance.transaction.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SavingReportService {
	private final TransactionRepository transactionRepository;
	private final SavingGoalRepository savingGoalRepository;

	/**
	 * 1️⃣ Tổng tiền tiết kiệm theo tháng
	 */
	public List<SavingMonthlyReportDto> getMonthlyReport() {
		User user = SecurityUtils.getCurrentUser();
		List<Object[]> rows = transactionRepository.getSavingTrendByMonth(user.getId());

		List<SavingMonthlyReportDto> result = new ArrayList<>();
		for (Object[] row : rows) {
			String month = (String) row[0];
			BigDecimal total = (BigDecimal) row[1];
			result.add(new SavingMonthlyReportDto(month, total));
		}
		return result;
	}

	/**
	 * 2️⃣ Top 3 goal đạt nhanh nhất
	 */
	public List<SavingGoalSummaryDto> getTopGoals() {
		User user = SecurityUtils.getCurrentUser();
		List<SavingGoal> goals = savingGoalRepository.findByUserIdOrderByCreatedAtDesc(user.getId());

		// Lấy top 3 goal có tiến độ cao nhất (tính theo currentAmount / targetAmount)
		return goals.stream()
				.filter(g -> g.getTargetAmount() != null && g.getTargetAmount().compareTo(BigDecimal.ZERO) > 0)
				.sorted((g1, g2) -> {
					double p1 = g1.getCurrentAmount().divide(g1.getTargetAmount(), 4, RoundingMode.HALF_UP)
							.doubleValue();
					double p2 = g2.getCurrentAmount().divide(g2.getTargetAmount(), 4, RoundingMode.HALF_UP)
							.doubleValue();
					return Double.compare(p2, p1); // Descending (cao nhất trước)
				}).limit(3).map(g -> new SavingGoalSummaryDto(g.getId(), g.getName(), g.getTargetAmount(),
						g.getCurrentAmount(), g.getStartDate(), g.getEndDate(), g.getStatus()))
				.toList();
	}

	/**
	 * 3️⃣ Goals bị hủy hoặc chưa đạt
	 */
	public List<SavingGoalSummaryDto> getFailedGoals() {
		User user = SecurityUtils.getCurrentUser();
		List<SavingGoal> goals = savingGoalRepository.findByUserIdOrderByCreatedAtDesc(user.getId());

		return goals.stream().filter(
				g -> g.getStatus() == SavingGoalStatus.CANCELLED || (g.getStatus() == SavingGoalStatus.IN_PROGRESS
						&& g.getEndDate() != null && g.getEndDate().isBefore(java.time.LocalDate.now())
						&& g.getCurrentAmount().compareTo(g.getTargetAmount()) < 0))
				.map(g -> new SavingGoalSummaryDto(g.getId(), g.getName(), g.getTargetAmount(), g.getCurrentAmount(),
						g.getStartDate(), g.getEndDate(), g.getStatus()))
				.toList();
	}

}
