package com.finance.saving.entity;

import com.finance.auth.entity.User;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "saving_history")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class SavingHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "saving_goal_id", nullable = false)
    private SavingGoal savingGoal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String action;  // e.g. "Deposit", "Update goal", "Achieved"

    private BigDecimal amount;      // số tiền thay đổi (nếu có)
    private BigDecimal totalAfter;  // tổng tiền sau hành động

    private LocalDateTime timestamp = LocalDateTime.now();
}
