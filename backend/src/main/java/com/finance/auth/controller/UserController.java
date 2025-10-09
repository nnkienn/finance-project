package com.finance.auth.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.finance.auth.dto.ApiMessage;
import com.finance.auth.dto.MeResponse;
import com.finance.auth.dto.UserUpdateDto;
import com.finance.auth.entity.Role;
import com.finance.auth.repository.UserRepository;
import com.finance.auth.service.UserService;

import jakarta.validation.Valid;

@RestController
public class UserController {

    private final UserRepository userRepository;
    private final UserService userService;
    public UserController(UserRepository userRepository , UserService userService ) {
        this.userRepository = userRepository;
        this.userService = userService;
        
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
    
    @PatchMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MeResponse> updateMe(Authentication authentication, @Valid @RequestBody UserUpdateDto dto) {
        try {
            MeResponse updated = userService.updateUser(dto, authentication);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            // Simple exception handling; consider a global handler for production
            return ResponseEntity.badRequest().body(null);
        }
    }
}
