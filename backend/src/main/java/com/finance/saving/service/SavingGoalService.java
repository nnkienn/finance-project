package com.finance.saving.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.finance.auth.entity.User;
import com.finance.auth.util.SecurityUtils;
import com.finance.exception.SavingGoalDeleteException;
import com.finance.saving.dto.SavingGoalMapper;
import com.finance.saving.dto.SavingGoalRequest;
import com.finance.saving.dto.SavingGoalResponse;
import com.finance.saving.dto.SavingGoalUpdateRequest;
import com.finance.saving.entity.SavingGoal;
import com.finance.saving.entity.SavingGoalStatus;
import com.finance.saving.entity.SavingHistory;
import com.finance.saving.repository.SavingGoalRepository;
import com.finance.saving.repository.SavingHistoryRepository;
import com.finance.transaction.entity.Transaction;
import com.finance.transaction.entity.TransactionType;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class SavingGoalService {
	private final SavingGoalRepository savingGoalRepository;
	private final SavingHistoryRepository savingHistoryRepository;

	// ==========================CRUD=======================
	@Transactional
	public SavingGoalResponse create(@Valid SavingGoalRequest req) {
		User me = SecurityUtils.getCurrentUser();

		SavingGoal g = SavingGoal.builder().user(me).name(req.name()).targetAmount(req.targetAmount())
				.currentAmount(BigDecimal.ZERO).startDate(req.startDate()).endDate(req.endDate())
				.status(SavingGoalStatus.IN_PROGRESS).description(req.description()).build();

		SavingGoal saved = savingGoalRepository.save(g);
		return SavingGoalMapper.toResponse(g);
	}

	@Transactional(readOnly = true)
	public List<SavingGoalResponse> listSavingGoal() {
		User user = SecurityUtils.getCurrentUser();
		return savingGoalRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
				.map(SavingGoalMapper::toResponse).toList();
	}

	public SavingGoalResponse detail(Long id) {
		SavingGoal g = requireOwnedGoal(id);
		return SavingGoalMapper.toResponse(g);
	}

	public SavingGoalResponse update(Long id, @Valid SavingGoalUpdateRequest goalUpdateRequest) {
		SavingGoal goal = requireOwnedGoal(id);
		goal.setName(goalUpdateRequest.name());
		goal.setTargetAmount(goalUpdateRequest.targetAmount());
		goal.setEndDate(goalUpdateRequest.endDate());
		goal.setDescription(goalUpdateRequest.description());
		if (goal.getCurrentAmount() != null && goal.getTargetAmount() != null
				&& goal.getCurrentAmount().compareTo(goal.getTargetAmount()) >= 0) {
			goal.setStatus(SavingGoalStatus.ACHIEVED);
		} else if (goal.getStatus() == SavingGoalStatus.ACHIEVED) {
			goal.setStatus(SavingGoalStatus.IN_PROGRESS);
		}
		return SavingGoalMapper.toResponse(savingGoalRepository.save(goal));
	}

	@Transactional
	public void delete(long id) {
	    SavingGoal goal = requireOwnedGoal(id);

	    if (goal.getHistories() != null && !goal.getHistories().isEmpty()) {
	        throw new SavingGoalDeleteException("Cannot delete a saving goal that has history records.");
	    }

	    savingGoalRepository.delete(goal);
	}


	@Transactional
	public void updateProgressFromTransaction(Transaction tx) {
		if (tx.getType() != TransactionType.SAVING || tx.getSavingGoal() == null)
			return;

		SavingGoal goal = savingGoalRepository.findById(tx.getSavingGoal().getId()).orElse(null);
		if (goal == null)
			return;

		BigDecimal current = goal.getCurrentAmount() == null ? BigDecimal.ZERO : goal.getCurrentAmount();
		BigDecimal updated = current.add(tx.getAmount());
		goal.setCurrentAmount(updated);

		if (goal.getTargetAmount() != null && updated.compareTo(goal.getTargetAmount()) >= 0) {
			goal.setStatus(SavingGoalStatus.ACHIEVED);
		}

		savingGoalRepository.save(goal);

		// ✅ Lưu lịch sử tiết kiệm
		SavingHistory history = SavingHistory.builder().savingGoal(goal).user(goal.getUser()).action("Deposit")
				.amount(tx.getAmount()).totalAfter(updated).build();
		savingHistoryRepository.save(history);
	}

	// ===== helpers =====
	public SavingGoal requireOwnedGoal(Long id) {
		User me = SecurityUtils.getCurrentUser();
		System.out.println("Saving goal" + id);
		return savingGoalRepository.findByIdAndUserId(id, me.getId())
				.orElseThrow(() -> new RuntimeException("Saving goal not found or not yours"));
	}

	@Transactional
	public void adjustAmountForUpdate(SavingGoal goal, java.math.BigDecimal delta, String action) {
		SavingGoal g = savingGoalRepository.findById(goal.getId())
				.orElseThrow(() -> new RuntimeException("Saving goal not found"));
		java.math.BigDecimal cur = g.getCurrentAmount() == null ? java.math.BigDecimal.ZERO : g.getCurrentAmount();
		java.math.BigDecimal updated = cur.add(delta);
		if (updated.compareTo(java.math.BigDecimal.ZERO) < 0) {
			updated = java.math.BigDecimal.ZERO; // đảm bảo không âm
		}

		g.setCurrentAmount(updated);

		// cập nhật trạng thái
		if (g.getTargetAmount() != null && updated.compareTo(g.getTargetAmount()) >= 0) {
			g.setStatus(SavingGoalStatus.ACHIEVED);
		} else {
			g.setStatus(SavingGoalStatus.IN_PROGRESS);
		}

		savingGoalRepository.save(g);

		SavingHistory history = SavingHistory.builder().savingGoal(g).user(g.getUser()).action(action).amount(delta) // delta
																														// có
																														// thể
																														// âm
																														// (rollback)
				.totalAfter(updated).build();
		savingHistoryRepository.save(history);
	}

	@Transactional
	public void handleTransactionGoalUpdate(User user, Transaction tx, TransactionType oldType, SavingGoal oldGoal,
			BigDecimal oldAmount, com.finance.transaction.dto.TransactionRequest request) {
		TransactionType newType = request.getType();
		BigDecimal newAmount = request.getAmount() == null ? BigDecimal.ZERO : request.getAmount();

		if (oldType == TransactionType.SAVING && newType == TransactionType.SAVING) {
			// SAVING -> SAVING (cùng goal hoặc đổi goal)
			Long newGoalId = request.getSavingGoalId();
			if (newGoalId == null) {
				throw new RuntimeException("savingGoalId is required for SAVING transactions");
			}
			SavingGoal newGoal = requireOwnedGoal(newGoalId);

			if (oldGoal != null && !oldGoal.getId().equals(newGoal.getId())) {
				// chuyển sang goal mới: trừ goal cũ, cộng goal mới
				adjustAmountForUpdate(oldGoal, oldAmount.negate(), "Revert due to transaction update");
				adjustAmountForUpdate(newGoal, newAmount, "Deposit due to transaction update");
			} else {
				// cùng goal: chỉ điều chỉnh phần chênh lệch
				BigDecimal diff = newAmount.subtract(oldAmount);
				if (diff.signum() != 0) {
					adjustAmountForUpdate(newGoal, diff, "Adjust due to transaction update");
				}
			}
			tx.setSavingGoal(newGoal);

		} else if (oldType == TransactionType.SAVING && newType != TransactionType.SAVING) {
			// SAVING -> NON-SAVING
			if (oldGoal != null) {
				adjustAmountForUpdate(oldGoal, oldAmount.negate(), "Revert due to transaction update (to non-saving)");
			}
			tx.setSavingGoal(null);

		} else if (oldType != TransactionType.SAVING && newType == TransactionType.SAVING) {
			// NON-SAVING -> SAVING
			Long newGoalId = request.getSavingGoalId();
			if (newGoalId == null) {
				throw new RuntimeException("savingGoalId is required for SAVING transactions");
			}
			SavingGoal newGoal = requireOwnedGoal(newGoalId);
			adjustAmountForUpdate(newGoal, newAmount, "Deposit due to transaction update (to saving)");
			tx.setSavingGoal(newGoal);

		} else {
			// NON-SAVING -> NON-SAVING
			tx.setSavingGoal(null);
		}
	}

}
