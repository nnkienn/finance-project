package com.finance.saving.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.finance.saving.dto.SavingGoalProgressDto;
import com.finance.saving.dto.SavingSummaryDto;
import com.finance.saving.dto.SavingTrendPoint;
import com.finance.saving.service.SavingGoalAnalyticsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/saving-goals")
@RequiredArgsConstructor
public class SavingGoalAnalyticsController {
	private final SavingGoalAnalyticsService savingGoalAnalyticsService;

	@GetMapping("/progress")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<List<SavingGoalProgressDto>> getProgress() {
		return ResponseEntity.ok(savingGoalAnalyticsService.getGoalProgress());
	}

	// ✅ /saving-goals/summary
	@GetMapping("/summary")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<SavingSummaryDto> getSummary() {
		return ResponseEntity.ok(savingGoalAnalyticsService.getSummary());
	}
	
	@GetMapping("/trend")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<List<SavingTrendPoint>> getTrend(
	        @RequestParam(required = false, defaultValue = "MONTHLY") String granularity) {
	    return ResponseEntity.ok(savingGoalAnalyticsService.getTrend(granularity));
	}

}
