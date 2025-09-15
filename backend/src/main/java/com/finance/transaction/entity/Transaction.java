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
        @Index(name = "idx_transactions_user_date", columnList = "user_id, transactionDate"),
        @Index(name = "idx_transactions_type", columnList = "type")
    }
)
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Transaction {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable = false, precision = 15,scale = 2)
	private BigDecimal amount; 
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private TransactionType type;
	

    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    private PaymentMethod paymentMethod = PaymentMethod.CASH;
    
    @Column(length = 30, nullable = false)
    private String note;
    
    @Column(nullable = false)
    private LocalDateTime transactionDate = LocalDateTime.now();
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_category_id", nullable = false)
    private UserCategory userCategory;
    
    private boolean recurring = false;
    
    private boolean activeRecurring = true;
    
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private RecurringFrequency frequency;
    
    private LocalDateTime startDate;
    
    private LocalDateTime endDate;
    
    private LocalDateTime nextRunTime;
    

	
	
	
	
	
}
