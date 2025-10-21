package com.finance.transaction.service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.finance.auth.entity.User;
import com.finance.auth.util.SecurityUtils;
import com.finance.transaction.dto.MonthlyCardsResponse;
import com.finance.transaction.entity.TransactionType;
import com.finance.transaction.repository.TransactionRepository;
import com.finance.transaction.repository.TransactionRepository.Kpis2;
import com.finance.transaction.repository.TransactionRepository.Kpis3;
import com.finance.transaction.repository.TransactionRepository.LabelAmount;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransactionAnalysticService {
	private final TransactionRepository transactionRepository;

	/**
	 * KPI theo tháng: INCOME, EXPENSE, NET (projection Kpis2)
	 */
	@Transactional(readOnly = true)
	public Map<String, BigDecimal> getMonthlySummary(int month, int year) {
		User user = SecurityUtils.getCurrentUser();
		Kpis2 r = transactionRepository.kpisByMonth(user.getId(), month, year);

		BigDecimal income = (r != null && r.getIncome() != null) ? r.getIncome() : BigDecimal.ZERO;
		BigDecimal expense = (r != null && r.getExpense() != null) ? r.getExpense() : BigDecimal.ZERO;
		BigDecimal net = income.subtract(expense);

		Map<String, BigDecimal> out = new HashMap<>();
		out.put("INCOME", income);
		out.put("EXPENSE", expense);
		out.put("NET", net);
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
		List<LabelAmount> rows = transactionRepository.getPaymentMethodBreakdownPg(user.getId(), month, year,
				type.name());
		for (LabelAmount r : rows) {
			res.put(r.getLabel(), r.getAmount() == null ? BigDecimal.ZERO : r.getAmount());
		}
		return res;
	}

	@Transactional(readOnly = true)
	public MonthlyCardsResponse getMonthlyCards(int month, int year) {
		User user = SecurityUtils.getCurrentUser();

		Kpis3 cur = transactionRepository.kpisByMonth3(user.getId(), month, year);
		BigDecimal income = (cur != null && cur.getIncome() != null) ? cur.getIncome() : BigDecimal.ZERO;
		BigDecimal expense = (cur != null && cur.getExpense() != null) ? cur.getExpense() : BigDecimal.ZERO;
		BigDecimal saving = (cur != null && cur.getSaving() != null) ? cur.getSaving() : BigDecimal.ZERO;

		boolean savingAsOutflow = true;
		BigDecimal myBalance = savingAsOutflow ? income.subtract(expense).subtract(saving) : income.subtract(expense);

		int prevMonth = month == 1 ? 12 : month - 1;
		int prevYear = month == 1 ? year - 1 : year;
		Kpis3 prev = transactionRepository.kpisByMonth3(user.getId(), prevMonth, prevYear);
		BigDecimal pIncome = (prev != null && prev.getIncome() != null) ? prev.getIncome() : BigDecimal.ZERO;
		BigDecimal pExpense = (prev != null && prev.getExpense() != null) ? prev.getExpense() : BigDecimal.ZERO;
		BigDecimal pSaving = (prev != null && prev.getSaving() != null) ? prev.getSaving() : BigDecimal.ZERO;

		java.util.function.BiFunction<BigDecimal, BigDecimal, BigDecimal> pct = (curV, prevV) -> (prevV.signum() == 0)
				? BigDecimal.ZERO
				: curV.subtract(prevV).multiply(BigDecimal.valueOf(100)).divide(prevV, 2,
						java.math.RoundingMode.HALF_UP);

		return new MonthlyCardsResponse(myBalance, income, saving, expense, pct.apply(income, pIncome),
				pct.apply(saving, pSaving), pct.apply(expense, pExpense));
	}

	// ====== Tổng số tiền theo loại giao dịch ======

	@Transactional(readOnly = true)
	public BigDecimal getTotalSaving() {
		User user = SecurityUtils.getCurrentUser();
		BigDecimal total = transactionRepository.sumAmountByUserAndType(user.getId(), TransactionType.SAVING);
		return total != null ? total : BigDecimal.ZERO;
	}

	@Transactional(readOnly = true)
	public BigDecimal getTotalIncome() {
		User user = SecurityUtils.getCurrentUser();
		BigDecimal total = transactionRepository.sumAmountByUserAndType(user.getId(), TransactionType.INCOME);
		return total != null ? total : BigDecimal.ZERO;
	}

	@Transactional(readOnly = true)
	public BigDecimal getTotalExpense() {
		User user = SecurityUtils.getCurrentUser();
		BigDecimal total = transactionRepository.sumAmountByUserAndType(user.getId(), TransactionType.EXPENSE);
		return total != null ? total : BigDecimal.ZERO;
	}

}
