package com.finance.finance.controller;

import com.finance.finance.user.dto.ApiMessage;
import com.finance.finance.user.dto.MeResponse;
import com.finance.finance.user.entity.Role;
import com.finance.finance.user.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> me(Authentication authentication) {
        String email = authentication.getName();
        var user = userRepository.findByEmail(email.toLowerCase()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiMessage("User not found"));
        }

        var roles = user.getRoles().stream().map(Role::getName).toList();

        var body = new MeResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getAvatarUrl(),
                user.getFacebookId(),
                user.getGoogleId(),
                user.getCreatedAt(),
                user.isEnabled(),
                user.getEmailVerifiedAt(),
                roles
        );

        return ResponseEntity.ok(body);

    }
}
