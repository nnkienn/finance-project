package com.finance.saving.controller;

import com.finance.saving.dto.SavingMonthlyReportDto;
import com.finance.saving.dto.SavingGoalSummaryDto;
import com.finance.saving.service.SavingReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/saving-report")
@RequiredArgsConstructor
public class SavingReportController {

    private final SavingReportService reportService;

    @GetMapping("/monthly")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<SavingMonthlyReportDto>> getMonthlyReport() {
        return ResponseEntity.ok(reportService.getMonthlyReport());
    }

    @GetMapping("/top-goals")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<SavingGoalSummaryDto>> getTopGoals() {
        return ResponseEntity.ok(reportService.getTopGoals());
    }

    @GetMapping("/failure")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<SavingGoalSummaryDto>> getFailedGoals() {
        return ResponseEntity.ok(reportService.getFailedGoals());
    }
}
