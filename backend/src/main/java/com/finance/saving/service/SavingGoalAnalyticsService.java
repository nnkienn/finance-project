package com.finance.saving.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import com.finance.auth.entity.User;
import com.finance.auth.util.SecurityUtils;
import com.finance.saving.dto.SavingGoalProgressDto;
import com.finance.saving.dto.SavingSummaryDto;
import com.finance.saving.dto.SavingTrendPoint;
import com.finance.saving.entity.SavingGoal;
import com.finance.saving.entity.SavingGoalStatus;
import com.finance.saving.repository.SavingGoalRepository;
import com.finance.transaction.repository.TransactionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SavingGoalAnalyticsService {
	private final SavingGoalRepository savingGoalRepository;
	private final TransactionRepository transactionRepository;

	public List<SavingGoalProgressDto> getGoalProgress() {
		User user = SecurityUtils.getCurrentUser();
		List<Object[]> rows = savingGoalRepository.getGoalProgressByUser(user.getId());

		return rows.stream().map(r -> new SavingGoalProgressDto(((Number) r[0]).longValue(), (String) r[1],
				(BigDecimal) r[2], (BigDecimal) r[3], ((Number) r[4]).doubleValue())).toList();
	}

	// ✅ 2. Tổng hợp summary
	public SavingSummaryDto getSummary() {
		User user = SecurityUtils.getCurrentUser();

		List<SavingGoal> goals = savingGoalRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
		BigDecimal totalSaved = savingGoalRepository.getTotalSavedByUser(user.getId());

		int totalGoals = goals.size();
		int achieved = (int) goals.stream().filter(g -> g.getStatus() == SavingGoalStatus.ACHIEVED).count();
		int active = (int) goals.stream().filter(g -> g.getStatus() == SavingGoalStatus.IN_PROGRESS).count();

		return new SavingSummaryDto(totalSaved, totalGoals, achieved, active);
	}

	public List<SavingTrendPoint> getTrend(String granularity) {
		User user = SecurityUtils.getCurrentUser();

		List<Object[]> rows = switch ((granularity == null ? "MONTHLY" : granularity).toUpperCase()) {
		case "WEEKLY" -> transactionRepository.getSavingTrendByWeek(user.getId());
		default -> transactionRepository.getSavingTrendByMonth(user.getId());
		};

		return rows.stream().map(r -> new SavingTrendPoint((String) r[0], (BigDecimal) r[1])).toList();
	}
}
