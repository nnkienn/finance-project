package com.finance.transaction.controller;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.finance.transaction.dto.MonthlyCardsResponse;
import com.finance.transaction.entity.TransactionType;
import com.finance.transaction.service.TransactionAnalysticService;

import lombok.RequiredArgsConstructor;
@RestController
@RequestMapping("/api/transactions/analytics")
@RequiredArgsConstructor   
public class TransactionAnalysticController {
	
	private final TransactionAnalysticService transactionAnalysticService;
	
	 // ====== KPIs cơ bản (INCOME/EXPENSE/NET) - nếu bạn vẫn muốn giữ /summary kiểu Map ======
    @GetMapping("/summary")
    public ResponseEntity<Map<String, BigDecimal>> getMonthlySummary(
            @RequestParam int month,
            @RequestParam int year
    ) {
        return ResponseEntity.ok(transactionAnalysticService.getMonthlySummary(month, year));
    }

    // ====== Cards cho 4 ô: MyBalance / Income / Savings / Expenses (+% so với tháng trước) ======
    @GetMapping("/cards")
    public ResponseEntity<MonthlyCardsResponse> getMonthlyCards(
            @RequestParam int month,
            @RequestParam int year
    ) {
        return ResponseEntity.ok(transactionAnalysticService.getMonthlyCards(month, year));
    }

    // ====== Pie theo DANH MỤC (All Expenses) ======
    @GetMapping("/category-breakdown")
    public ResponseEntity<Map<String, BigDecimal>> getCategoryBreakdown(
            @RequestParam int month,
            @RequestParam int year,
            @RequestParam(defaultValue = "EXPENSE") TransactionType type // cho phép đổi sang INCOME nếu cần
    ) {
        return ResponseEntity.ok(transactionAnalysticService.getCategoryBreakdown(month, year, type));
    }

    // ====== Pie theo PHƯƠNG THỨC thanh toán ======
    @GetMapping("/payment-breakdown")
    public ResponseEntity<Map<String, BigDecimal>> getPaymentMethodBreakdown(
            @RequestParam int month,
            @RequestParam int year,
            @RequestParam(defaultValue = "EXPENSE") TransactionType type
    ) {
        return ResponseEntity.ok(transactionAnalysticService.getPaymentMethodBreakdown(month, year, type));
    }
    
    // ====== Tổng tiết kiệm ======
    @GetMapping("/total-saving")
    public ResponseEntity<BigDecimal> getTotalSaving() {
        return ResponseEntity.ok(transactionAnalysticService.getTotalSaving());
    }

    // ====== Tổng thu ======
    @GetMapping("/total-income")
    public ResponseEntity<BigDecimal> getTotalIncome() {
        return ResponseEntity.ok(transactionAnalysticService.getTotalIncome());
    }

    // ====== Tổng chi ======
    @GetMapping("/total-expense")
    public ResponseEntity<BigDecimal> getTotalExpense() {
        return ResponseEntity.ok(transactionAnalysticService.getTotalExpense());
    }
    @GetMapping("/total-all")
    public ResponseEntity<Map<String, BigDecimal>> getAllTotals() {
        Map<String, BigDecimal> totals = new HashMap<>();
        totals.put("totalIncome", transactionAnalysticService.getTotalIncome());
        totals.put("totalExpense", transactionAnalysticService.getTotalExpense());
        totals.put("totalSaving", transactionAnalysticService.getTotalSaving());
        return ResponseEntity.ok(totals);
    }



}
