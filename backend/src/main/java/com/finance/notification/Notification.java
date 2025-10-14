package com.finance.notification;

import com.finance.auth.entity.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "notification",
       indexes = {
           @Index(name = "idx_notification_user_status", columnList = "user_id, status"),
           @Index(name = "idx_notification_status_created", columnList = "status, created_at")
       })
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(length = 100)
    private String type; // e.g. "saving.achieved", "transaction.created"

    @Column(length = 255)
    private String title;

    @Column(length = 1000)
    private String body;

    @Column(columnDefinition = "jsonb")
    private String payload;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private NotificationStatus status = NotificationStatus.PENDING;

    private Integer attempts = 0;

    // ✅ thêm field này để fix lỗi repository
    @Column(name = "is_read", nullable = false)
    private boolean isRead = false;

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();

    @Column(name = "sent_at")
    private Instant sentAt;
}
