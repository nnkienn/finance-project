package com.finance.transaction.entity;

import com.finance.auth.entity.User;
import com.finance.category.entity.UserCategory;
import com.finance.saving.entity.SavingGoal;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions",
       indexes = {
           @Index(name = "idx_transactions_user_date", columnList = "user_id, transaction_date"),
           @Index(name = "idx_transactions_type", columnList = "type"),
           @Index(name = "idx_tx_user_category", columnList = "user_category_id")
       })
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Transaction {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 20)
    private TransactionType type;

    @Enumerated(EnumType.STRING)
    @Column(name = "method", length = 30, nullable = false)
    private PaymentMethod paymentMethod = PaymentMethod.CASH;

    @Column(length = 255, nullable = false)
    private String note;

    @Column(name = "transaction_date", nullable = false)
    private LocalDateTime transactionDate = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_category_id", nullable = false)
    private UserCategory userCategory;

    /** Back-ref: giao dịch này được tạo từ occurrence nào (nếu có) */
    @OneToOne(mappedBy = "postedTransaction", fetch = FetchType.LAZY)
    private com.finance.recurring.entity.RecurringOccurrence recurringOccurrence;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "saving_goal_id")
    private SavingGoal savingGoal;
    
    

}
