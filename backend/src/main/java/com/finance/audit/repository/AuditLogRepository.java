// com/finance/audit/repository/AuditLogRepository.java
package com.finance.audit.repository;

import com.finance.audit.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {}
