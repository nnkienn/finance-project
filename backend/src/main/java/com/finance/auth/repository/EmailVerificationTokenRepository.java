package com.finance.auth.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.finance.auth.entity.EmailVerificationToken;

import java.util.Optional;

public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, Long> {
    Optional<EmailVerificationToken> findByToken(String token);
}

