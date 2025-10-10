package com.finance.saving.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.finance.auth.entity.User;
import com.finance.auth.util.SecurityUtils;
import com.finance.saving.dto.SavingGoalMapper;
import com.finance.saving.dto.SavingGoalRequest;
import com.finance.saving.dto.SavingGoalResponse;
import com.finance.saving.dto.SavingGoalUpdateRequest;
import com.finance.saving.entity.SavingGoal;
import com.finance.saving.entity.SavingGoalStatus;
import com.finance.saving.repository.SavingGoalRepository;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class SavingGoalService {
	private final SavingGoalRepository savingGoalRepository;
	//==========================CRUD=======================
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
	public List<SavingGoalResponse> listSavingGoal(){
		User user = SecurityUtils.getCurrentUser();
		return savingGoalRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream().map(SavingGoalMapper::toResponse).toList();
	}
	
	public SavingGoalResponse detail(Long id) {
		SavingGoal g = requireOwnedGoal(id);
		return SavingGoalMapper.toResponse(g);
	}
	
	public SavingGoalResponse update(Long id,@Valid SavingGoalUpdateRequest goalUpdateRequest) {
		SavingGoal goal = requireOwnedGoal(id);
		goal.setName(goalUpdateRequest.name());
		goal.setTargetAmount(goalUpdateRequest.targetAmount());
		goal.setEndDate(goalUpdateRequest.endDate());
		goal.setDescription(goalUpdateRequest.description());
		if(goal.getCurrentAmount() != null && goal.getTargetAmount() != null && goal.getCurrentAmount().compareTo(goal.getTargetAmount()) >=0) {
			goal.setStatus(SavingGoalStatus.ACHIEVED);
		}
		else if(goal.getStatus() == SavingGoalStatus.ACHIEVED) {
			goal.setStatus(SavingGoalStatus.IN_PROGRESS);
		}
		return SavingGoalMapper.toResponse(savingGoalRepository.save(goal));
	}
	
	public void delete(long id) {
		SavingGoal goal = requireOwnedGoal(id);
		savingGoalRepository.delete(goal);
	}
	 // ===== helpers =====
    private SavingGoal requireOwnedGoal(Long id) {
        User me = SecurityUtils.getCurrentUser();
        return savingGoalRepository.findByIdAndUserId(id, me.getId())
                .orElseThrow(() -> new RuntimeException("Saving goal not found or not yours"));
    }
	
	
}
