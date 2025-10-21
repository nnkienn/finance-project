package com.finance.audit.controller;

import com.finance.audit.entity.AuditLog;
import com.finance.audit.repository.AuditLogRepository;
import com.finance.auth.entity.User;
import com.finance.auth.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogRepository repo;

    /**
     * 🧾 Lấy tất cả log của user hiện tại (hoặc toàn bộ nếu là admin)
     */
    @GetMapping
    public List<AuditLog> list(@RequestParam(required = false) String entityType) {
        User user = SecurityUtils.getCurrentUser();

        // Nếu có entityType -> filter theo type
        if (entityType != null && !entityType.isBlank()) {
            return repo.findByUserIdAndEntityTypeOrderByCreatedAtDesc(user.getId(), entityType);
        }

        return repo.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    /**
     * 🔍 Xem chi tiết 1 log cụ thể
     */
    @GetMapping("/{id}")
    public AuditLog getOne(@PathVariable Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Audit log not found"));
    }
}
