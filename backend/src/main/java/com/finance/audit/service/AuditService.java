// com/finance/audit/service/AuditService.java
package com.finance.audit.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.finance.audit.entity.AuditLog;
import com.finance.audit.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuditService {
    private final AuditLogRepository repo;
    private final ObjectMapper objectMapper;

    public void log(Long userId, String action, String entityType, String entityId, Object payload) {
        var node = objectMapper.valueToTree(payload);
        var log = AuditLog.builder()
                .userId(userId)
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .payload(node)
                .build();
        repo.save(log);
    }
}
