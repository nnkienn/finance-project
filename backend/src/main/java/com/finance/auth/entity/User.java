package com.finance.auth.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

import com.finance.category.entity.UserCategory;
import com.finance.notification.Notification;
import com.finance.saving.entity.SavingGoal;
import com.finance.transaction.entity.Transaction;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "users", indexes = {
        @Index(name = "idx_users_email", columnList = "email", unique = true)
})
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ========== Authentication ==========
    @Email
    @NotBlank
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank
    private String password;

    private boolean enabled = false;

    private LocalDateTime emailVerifiedAt;

    // ========== Profile Info ==========
    private String fullName;
    private String avatarUrl;

    private LocalDate dateOfBirth;              // ✅ thêm ngày sinh
    private String gender;                      // "MALE", "FEMALE", "OTHER"
    private String phoneNumber;                 // ✅ để gửi SMS hoặc OTP
    private String preferredLanguage = "en";    // ngôn ngữ ưu tiên
    private String timezone = "Asia/Ho_Chi_Minh";
    private String notificationChannel = "EMAIL"; // EMAIL / PUSH / BOTH

    // ========== Social Login ==========
    private String facebookId;
    private String googleId;

    // ========== Meta ==========
    private LocalDateTime createdAt = LocalDateTime.now();

    // ========== Relationships ==========
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserCategory> userCategories = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Transaction> transactions = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SavingGoal> savingGoals = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Notification> notifications = new ArrayList<>();
}
