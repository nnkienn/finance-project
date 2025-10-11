package com.finance.saving.service;

import java.math.BigDecimal;
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
import java.util.*;   
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

        return goals.stream()
                .filter(g -> g.getStatus() == SavingGoalStatus.ACHIEVED && g.getStartDate() != null && g.getEndDate() != null)
                .sorted(Comparator.comparingLong(g -> java.time.temporal.ChronoUnit.DAYS.between(g.getStartDate(), g.getEndDate())))
                .limit(3)
                .map(g -> new SavingGoalSummaryDto(
                        g.getId(),
                        g.getName(),
                        g.getTargetAmount(),
                        g.getCurrentAmount(),
                        g.getStartDate(),
                        g.getEndDate(),
                        g.getStatus()
                ))
                .toList();
    }

    /**
     * 3️⃣ Goals bị hủy hoặc chưa đạt
     */
    public List<SavingGoalSummaryDto> getFailedGoals() {
        User user = SecurityUtils.getCurrentUser();
        List<SavingGoal> goals = savingGoalRepository.findByUserIdOrderByCreatedAtDesc(user.getId());

        return goals.stream()
                .filter(g ->
                        g.getStatus() == SavingGoalStatus.CANCELLED ||
                        (g.getStatus() == SavingGoalStatus.IN_PROGRESS &&
                                g.getEndDate() != null &&
                                g.getEndDate().isBefore(java.time.LocalDate.now()) &&
                                g.getCurrentAmount().compareTo(g.getTargetAmount()) < 0)
                )
                .map(g -> new SavingGoalSummaryDto(
                        g.getId(),
                        g.getName(),
                        g.getTargetAmount(),
                        g.getCurrentAmount(),
                        g.getStartDate(),
                        g.getEndDate(),
                        g.getStatus()
                ))
                .toList();
    }
    
    
}
