package com.finance.finance.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "email_verification_tokens", indexes = {
    @Index(name = "idx_evt_token", columnList = "token", unique = true)
})
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmailVerificationToken {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private User user;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @Column(nullable = false)
    private boolean used = false;

    // ✅ tiện lợi: khởi tạo 3 tham số như bạn đang dùng
    public EmailVerificationToken(String token, User user, LocalDateTime expiresAt) {
        this.token = token;
        this.user = user;
        this.expiresAt = expiresAt;
        this.used = false;
    }
}
