package com.finance.recurring.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.finance.recurring.dto.OccurrenceActionRequest;
import com.finance.recurring.dto.RecurringTemplateRequest;
import com.finance.recurring.dto.RecurringTemplateResponse;
import com.finance.recurring.dto.RecurringOccurrenceResponse;
import com.finance.recurring.entity.RecurringOccurrence;
import com.finance.recurring.mapper.RecurringOccurrenceMapper;
import com.finance.recurring.mapper.RecurringTemplateMapper;
import com.finance.recurring.service.RecurringService;
import com.finance.transaction.dto.TransactionMapper;
import com.finance.transaction.dto.TransactionResponse;
import com.finance.transaction.entity.Transaction;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/recurring")
@RequiredArgsConstructor
public class RecurringController {

    private final RecurringService recurringService;
    @PostMapping("/templates")
    public ResponseEntity<RecurringTemplateResponse> createTemplate(@RequestBody RecurringTemplateRequest req) {
        return ResponseEntity.ok(
            RecurringTemplateMapper.toResponse(recurringService.createTemplate(req))
        );
    }

    @GetMapping("/occurrences/due")
    public ResponseEntity<List<RecurringOccurrenceResponse>> getDue() {
        return ResponseEntity.ok(
            recurringService.getDueOccurrences()
                .stream()
                .map(RecurringOccurrenceMapper::toResponse)
                .toList()
        );
    }

    /** Confirm occurrence */
    @PostMapping("/occurrences/{id}/confirm")
    public ResponseEntity<TransactionResponse> confirm(@PathVariable Long id,
                                                       @RequestBody(required = false) OccurrenceActionRequest req) {
        Transaction tx = recurringService.confirmOccurrence(id, req);
        return ResponseEntity.ok(TransactionMapper.toResponse(tx));
    }

    /** Skip occurrence */
    @PostMapping("/occurrences/{id}/skip")
    public ResponseEntity<Void> skip(@PathVariable Long id) {
        recurringService.skipOccurrence(id);
        return ResponseEntity.noContent().build();
    }

    /** Snooze occurrence */
    @PostMapping("/occurrences/{id}/snooze")
    public ResponseEntity<Void> snooze(@PathVariable Long id,
                                       @RequestParam(defaultValue = "2") int days) {
        recurringService.snoozeOccurrence(id, days);
        return ResponseEntity.noContent().build();
    }

    /** Autopay */
    @PostMapping("/autopay/run-once")
    public ResponseEntity<String> autopay() {
        int n = recurringService.autopayRun();
        return ResponseEntity.ok("Autopay posted: " + n);
    }
}
