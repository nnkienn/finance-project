package com.finance.recurring.entity;

import com.finance.transaction.entity.Transaction;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "recurring_occurrences",
       uniqueConstraints = {
           @UniqueConstraint(name = "ux_occurrence_once", columnNames = {"template_id","occurrence_at"}),
           @UniqueConstraint(name = "ux_occurrence_posted_tx", columnNames = {"posted_transaction_id"})
       },
       indexes = {
           @Index(name = "idx_ro_template_status", columnList = "template_id,status"),
           @Index(name = "idx_ro_occurrence_at", columnList = "occurrence_at")
       })
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RecurringOccurrence {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "template_id", nullable = false)
    private RecurringTemplate template;

    @Column(name = "occurrence_at", nullable = false)
    private LocalDateTime occurrenceAt;

    @Enumerated(EnumType.STRING)
    @Column(length = 16, nullable = false)
    private RecurringStatus status = RecurringStatus.PLANNED; // PLANNED/POSTED/REVIEW/SKIPPED/MISSED

    @Column(precision = 15, scale = 2)
    private BigDecimal amountExpected; // có thể null nếu chưa biết

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "posted_transaction_id") // unique (ở unique constraint)
    private Transaction postedTransaction;
}
