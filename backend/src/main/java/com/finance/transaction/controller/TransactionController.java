package com.finance.transaction.controller;

import com.finance.transaction.dto.TransactionRequest;
import com.finance.transaction.dto.TransactionResponse;
import com.finance.transaction.entity.PaymentMethod;
import com.finance.transaction.entity.TransactionType;
import com.finance.transaction.service.TransactionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    // ================== CRUD ==================

    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(@Valid @RequestBody TransactionRequest request) {
        return ResponseEntity.ok(transactionService.createTransaction(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionResponse> getTransactionById(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.getTransactionById(id));
    }

    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getUserTransactions() {
        return ResponseEntity.ok(transactionService.getUserTransactions());
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransactionResponse> updateTransaction(@PathVariable Long id,
                                                                 @Valid @RequestBody TransactionRequest request) {
        return ResponseEntity.ok(transactionService.updateTransaction(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        transactionService.deleteTransaction(id);
        return ResponseEntity.noContent().build();
    }

    // ================== FILTER & ANALYTICS ==================

    /**
     * Filter transactions (không phân trang)
     */
    @GetMapping("/filter")
    public ResponseEntity<List<TransactionResponse>> getTransactionsFiltered(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,

            @RequestParam(required = false) TransactionType type,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) PaymentMethod paymentMethod
    ) {
    	 System.out.println("DEBUG >>> start=" + startDate + ", end=" + endDate +
                 ", type=" + type + ", categoryId=" + categoryId +
                 ", method=" + paymentMethod);
        return ResponseEntity.ok(
                transactionService.getTransactionsFiltered(startDate, endDate, type, categoryId, paymentMethod)
        );
    }

    /**
     * Filter transactions (có phân trang + sort)
     * Ví dụ: /api/transactions/filter-paged?page=0&size=10&sort=transactionDate,desc
     */
    @GetMapping("/filter-paged")
    public ResponseEntity<Page<TransactionResponse>> getTransactionsFilteredPaged(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,

            @RequestParam(required = false) TransactionType type,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) PaymentMethod paymentMethod,
            Pageable pageable 
    ) {
        return ResponseEntity.ok(
                transactionService.getTransactionsFilteredPaged(startDate, endDate, type, categoryId, paymentMethod, pageable)
        );
    }

    @GetMapping("/latest")
    public ResponseEntity<List<TransactionResponse>> getLatestTransactions(@RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(transactionService.getLatestTransactions(limit));
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, BigDecimal>> getMonthlySummary(
            @RequestParam int month,
            @RequestParam int year
    ) {
        return ResponseEntity.ok(transactionService.getMonthlySummary(month, year));
    }

    @GetMapping("/category-breakdown")
    public ResponseEntity<Map<String, BigDecimal>> getCategoryBreakdown(
            @RequestParam int month,
            @RequestParam int year
    ) {
        return ResponseEntity.ok(transactionService.getCategoryBreakdown(month, year));
    }

    @GetMapping("/payment-breakdown")
    public ResponseEntity<Map<String, BigDecimal>> getPaymentMethodBreakdown(
            @RequestParam int month,
            @RequestParam int year
    ) {
        return ResponseEntity.ok(transactionService.getPaymentMethodBreakdown(month, year));
    }
}
