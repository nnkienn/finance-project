package com.finance.saving.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.finance.saving.dto.SavingGoalRequest;
import com.finance.saving.dto.SavingGoalResponse;
import com.finance.saving.dto.SavingGoalUpdateRequest;
import com.finance.saving.dto.SavingHistoryDto;
import com.finance.saving.entity.SavingHistory;
import com.finance.saving.repository.SavingHistoryRepository;
import com.finance.saving.service.SavingGoalService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/saving-goals")
public class SavingGoalController {
	private final SavingGoalService savingGoalService;
	private final SavingHistoryRepository savingHistoryRepository;

	@PostMapping()
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<SavingGoalResponse> create(@Valid @RequestBody SavingGoalRequest goalRequest) {
		return ResponseEntity.ok(savingGoalService.create(goalRequest));
	}

	@GetMapping("/{id}")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<SavingGoalResponse> detail(@PathVariable Long id) {
		return ResponseEntity.ok(savingGoalService.detail(id));
	}

	@GetMapping()
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<List<SavingGoalResponse>> list() {
		return ResponseEntity.ok(savingGoalService.listSavingGoal());
	}

	@PutMapping("/{id}")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<SavingGoalResponse> update(@PathVariable Long id,
			@Valid @RequestBody SavingGoalUpdateRequest req) {
		return ResponseEntity.ok(savingGoalService.update(id, req));
	}

	// DELETE /saving-goals/{id}
	@DeleteMapping("/{id}")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		savingGoalService.delete(id);
		return ResponseEntity.noContent().build();
	}
	
	
	@GetMapping("/{id}/history")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<List<SavingHistoryDto>> getHistory(@PathVariable Long id) {
	    List<SavingHistoryDto> list = savingHistoryRepository.findBySavingGoalIdOrderByTimestampAsc(id)
	        .stream()
	        .map(h -> new SavingHistoryDto(
	                h.getId(),
	                h.getAction(),
	                h.getAmount(),
	                h.getTotalAfter(),
	                h.getTimestamp()
	        ))
	        .toList();

	    return ResponseEntity.ok(list);
	}



}
