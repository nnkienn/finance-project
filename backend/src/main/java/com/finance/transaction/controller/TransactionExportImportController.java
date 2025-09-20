package com.finance.transaction.controller;

import com.finance.auth.util.SecurityUtils;
import com.finance.transaction.service.TransactionExportImportService;
import com.itextpdf.text.DocumentException;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
@RestController
@RequestMapping("api/transactions/export")
@RequiredArgsConstructor
public class TransactionExportImportController {

    private final TransactionExportImportService exportImportService;

    @GetMapping("/csv")
    public ResponseEntity<Resource> exportCsv() throws IOException {
        Long userId = SecurityUtils.getCurrentUser().getId(); // 🔑 Lấy từ JWT
        File file = exportImportService.exportTransactionsToCsv(userId);
        Resource resource = new FileSystemResource(file);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=transactions.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(resource);
    }

    @GetMapping("/pdf")
    public ResponseEntity<Resource> exportPdf() throws IOException, DocumentException {
        Long userId = SecurityUtils.getCurrentUser().getId(); // 🔑 Lấy từ JWT
        File file = exportImportService.exportTransactionsToPDF(userId);
        Resource resource = new FileSystemResource(file);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=transactions.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource);
    }
}
