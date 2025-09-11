package com.finance.auth.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDateTime;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record MeResponse(
        Long id,
        String email,
        String fullName,
        String avatarUrl,
        String facebookId,
        String googleId,
        LocalDateTime createdAt,
        boolean enabled,
        LocalDateTime emailVerifiedAt,
        List<String> roles
) {}
