package com.finance.finance.user.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.finance.finance.user.entity.EmailVerificationToken;

import java.util.Optional;

public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, Long> {
    Optional<EmailVerificationToken> findByToken(String token);
}

