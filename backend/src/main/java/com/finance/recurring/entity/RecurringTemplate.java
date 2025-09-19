package com.finance.recurring.entity;

import com.finance.auth.entity.User;
import com.finance.category.entity.UserCategory;
import com.finance.transaction.entity.RecurringFrequency;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "recurring_templates",
       indexes = {
           @Index(name = "idx_rt_user_active", columnList = "user_id,is_active"),
           @Index(name = "idx_rt_user_category", columnList = "user_category_id"),
           @Index(name = "idx_rt_time_range", columnList = "start_at,end_at")
       })
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RecurringTemplate {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_category_id", nullable = false)
    private UserCategory userCategory;

    @Column(length = 64) private String providerCode;    // optional
    @Column(length = 64) private String customerCode;    // optional

    @Column(precision = 15, scale = 2) private BigDecimal limitAmount; // hạn mức autopay
    @Enumerated(EnumType.STRING) @Column(length = 16, nullable = false)
    private RecurringFrequency frequency;               // DAILY/WEEKLY/MONTHLY/YEARLY

    @Column(name = "start_at", nullable = false) private LocalDateTime startAt;
    @Column(name = "end_at") private LocalDateTime endAt;

    @Column(name = "is_active", nullable = false) private boolean active = true;
    @Column(name = "is_auto_pay", nullable = false) private boolean autoPay = false;

    @Column(length = 255) private String note;
    @Column(length = 64)  private String timezone = "Asia/Ho_Chi_Minh";

    /** Chiều ngược 1–N (tiện load) */
    @OneToMany(mappedBy = "template", fetch = FetchType.LAZY)
    private List<RecurringOccurrence> occurrences = new ArrayList<>();

    public void addOccurrence(RecurringOccurrence o) {
        occurrences.add(o);
        o.setTemplate(this);
    }
    public void removeOccurrence(RecurringOccurrence o) {
        occurrences.remove(o);
        o.setTemplate(null);
    }
}
