package com.finance.finance.controller;

import java.util.Map;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProtectedSampleController {

    @GetMapping("/user/only-user")
    @PreAuthorize("hasRole('USER')")
    public Map<String, Object> onlyUser() {
        return Map.of("ok", true, "who", "ROLE_USER or higher");
    }

    @GetMapping("/admin/only-admin")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Object> onlyAdmin() {
        return Map.of("ok", true, "who", "ROLE_ADMIN only");
    }
}
