package com.finance.notification;

import com.fasterxml.jackson.databind.JsonNode;
import com.finance.auth.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;

@Entity
@Table(
    name = "notifications",
    indexes = {
        @Index(name = "idx_notification_user_status", columnList = "user_id, status"),
        @Index(name = "idx_notification_status_created", columnList = "status, created_at")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Ai sẽ nhận thông báo
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Loại thông báo: "transaction.created", "saving.achieved", ...
    @Column(length = 100, nullable = false)
    private String type;

    @Column(length = 255, nullable = false)
    private String title;

    @Column(length = 1000)
    private String body;

    // Payload linh hoạt (JSONB trong Postgres)
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "payload", columnDefinition = "jsonb")
    private JsonNode payload;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private NotificationStatus status;

    @Column(nullable = false)
    private Integer attempts;

    @Column(name = "is_read", nullable = false)
    private boolean isRead;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "sent_at")
    private Instant sentAt;

    @PrePersist
    void prePersist() {
        if (createdAt == null) createdAt = Instant.now();
        if (status == null) status = NotificationStatus.PENDING;
        if (attempts == null) attempts = 0;
        // isRead default false
    }
}
