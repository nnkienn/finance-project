// com/finance/audit/entity/AuditLog.java
package com.finance.audit.entity;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;

@Entity
@Table(name = "audit_logs", indexes = {
    @Index(name = "idx_audit_user_time", columnList = "user_id, created_at")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AuditLog {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="user_id", nullable = false)
    private Long userId;

    @Column(nullable = false, length = 100)
    private String action; // "TRANSACTION_CREATED"

    @Column(name="entity_type", nullable = false, length = 50)
    private String entityType; // "Transaction"

    @Column(name="entity_id", nullable = false, length = 100)
    private String entityId;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb", nullable = false)
    private JsonNode payload;

    @Column(name="created_at", nullable = false)
    private Instant createdAt = Instant.now();
}
