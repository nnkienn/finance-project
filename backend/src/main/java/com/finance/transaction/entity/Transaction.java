package com.finance.transaction.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.finance.auth.entity.User;
import com.finance.category.entity.UserCategory;

@Entity
@Table(
	    name = "transactions",
	    indexes = {
	        @Index(name = "idx_transactions_user_date", columnList = "user_id, transaction_date"),
	        @Index(name = "idx_transactions_type", columnList = "type")
	    }
	)

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_category_id", nullable = false)
    private UserCategory userCategory;

    @Column(name = "is_recurring")
    private boolean recurring = false;

    @Column(name = "is_active_recurring")
    private boolean activeRecurring = true;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private RecurringFrequency frequency;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "next_run_time")
    private LocalDateTime nextRunTime;
}
