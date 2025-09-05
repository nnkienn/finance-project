package com.finance.finance.controller;

import com.finance.finance.user.dto.AdminUserDto;
import com.finance.finance.user.entity.Role;
import com.finance.finance.user.repository.RoleRepository;
import com.finance.finance.user.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')") 
public class AdminController {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public AdminController(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserDto>> listUsers() {
        List<AdminUserDto> data = userRepository.findAll()
            .stream()
            .map(u -> new AdminUserDto(
                    u.getId(),
                    u.getEmail(),
                    u.getFullName(),
                    u.getAvatarUrl(),
                    u.getFacebookId(),
                    u.getGoogleId(),
                    u.getCreatedAt(),
                    u.isEnabled(),
                    u.getEmailVerifiedAt(),
                    u.getRoles().stream().map(Role::getName).collect(Collectors.toList())
            ))
            .collect(Collectors.toList());

        return ResponseEntity.ok(data);
    }
}
