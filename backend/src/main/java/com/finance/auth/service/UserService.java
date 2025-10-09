package com.finance.auth.service;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.finance.auth.dto.MeResponse;
import com.finance.auth.dto.UserUpdateDto;
import com.finance.auth.entity.Role;
import com.finance.auth.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public MeResponse updateUser(UserUpdateDto userUpdateDto, Authentication authentication) {
        String email = authentication.getName();
        var user = userRepository.findByEmail(email.toLowerCase()).orElseThrow(() -> new RuntimeException("User not found"));

        if (userUpdateDto.getFullName() != null && !userUpdateDto.getFullName().isBlank()) {
            user.setFullName(userUpdateDto.getFullName());
        }

        if (userUpdateDto.getAvatarUrl() != null) {
            user.setAvatarUrl(userUpdateDto.getAvatarUrl());
        }

        if (userUpdateDto.getEmail() != null && !userUpdateDto.getEmail().equalsIgnoreCase(user.getEmail())) {
            String newEmail = userUpdateDto.getEmail().toLowerCase();
            if (userRepository.existsByEmail(newEmail)) {
                throw new RuntimeException("Email already in use");
            }
            user.setEmail(newEmail);
            user.setEnabled(false);
            // TODO: Trigger email verification for the new email address
        }

        userRepository.save(user);

        var roles = user.getRoles().stream().map(Role::getName).toList();

        return new MeResponse(
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
    }
}