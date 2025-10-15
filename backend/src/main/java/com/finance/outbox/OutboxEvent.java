package com.finance.outbox;

import java.time.Instant;

import com.fasterxml.jackson.databind.JsonNode;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "outbox", indexes = {
    @Index(name = "idx_outbox_status_createdat", columnList = "status, created_at")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class OutboxEvent {
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "aggregate_type", length = 100)
    private String aggregateType;

    @Column(name = "aggregate_id", length = 100)
    private String aggregateId;

    @Column(name = "event_type", length = 100)
    private String eventType;

    // lưu JSON payload dưới dạng text (Postgres jsonb tốt hơn nếu bạn cấu hình)
    @Column(columnDefinition = "jsonb", nullable = false)
    @JdbcTypeCode(SqlTypes.JSON)     // Hibernate 6 map JSON/JSONB
    private JsonNode payload;

    @Column(length = 20)
    private String status = "PENDING";

    private Integer attempts = 0;

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();
}
