package com.finance.audit.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.finance.audit.SavingAudit;

import java.util.List;

@Repository
public interface SavingAuditRepository extends JpaRepository<SavingAudit, Long> {

	List<SavingAudit> findByUserIdOrderByCreatedAtDesc(Long userId);

	List<SavingAudit> findByEventType(String eventType);
}