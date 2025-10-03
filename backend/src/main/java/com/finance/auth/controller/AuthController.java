package com.finance.auth.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.finance.auth.dto.AuthResponse;
import com.finance.auth.dto.ChangePasswordRequest;
import com.finance.auth.dto.LoginRequest;
import com.finance.auth.dto.RegisterRequest;
import com.finance.auth.entity.EmailVerificationToken;
import com.finance.auth.entity.Role;
import com.finance.auth.entity.User;
import com.finance.auth.repository.EmailVerificationTokenRepository;
import com.finance.auth.repository.RoleRepository;
import com.finance.auth.repository.UserRepository;
import com.finance.config.JwtService;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final EmailVerificationTokenRepository tokenRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Value("${app.verification.expire-minutes:60}")
    private long verificationExpireMinutes;

    public AuthController(
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            UserRepository userRepository,
            RoleRepository roleRepository,
            EmailVerificationTokenRepository tokenRepository,
            org.springframework.security.crypto.password.PasswordEncoder passwordEncoder
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail().toLowerCase())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Email already in use"));
        }

        User user = new User();
        user.setEmail(req.getEmail().toLowerCase());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setFullName(req.getFullName());
        user.setAvatarUrl(req.getAvatarUrl());
        user.setFacebookId(req.getFacebookId());
        user.setGoogleId(req.getGoogleId());
        user.setEnabled(false);

        var roleUser = roleRepository.findByName("ROLE_USER")
                .orElseGet(() -> roleRepository.save(new com.finance.auth.entity.Role(null, "ROLE_USER")));
        user.setRoles(new java.util.HashSet<>(java.util.List.of(roleUser)));
        userRepository.save(user);

        String token = UUID.randomUUID().toString().replace("-", "");
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(verificationExpireMinutes);
        EmailVerificationToken evt = new EmailVerificationToken(token, user, expiresAt);
        tokenRepository.save(evt);

        String verifyUrl = "/auth/verify?token=" + token;
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Registered. Please verify your email.",
                             "verifyToken", token,
                             "verifyUrl", verifyUrl));
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verify(@RequestParam("token") String token) {
        var evt = tokenRepository.findByToken(token).orElse(null);
        if (evt == null) return ResponseEntity.badRequest().body(Map.of("message", "Invalid token"));
        if (evt.isUsed()) return ResponseEntity.badRequest().body(Map.of("message", "Token already used"));
        if (evt.getExpiresAt().isBefore(LocalDateTime.now()))
            return ResponseEntity.badRequest().body(Map.of("message", "Token expired"));

        var user = evt.getUser();
        user.setEnabled(true);
        user.setEmailVerifiedAt(LocalDateTime.now());
        userRepository.save(user);

        evt.setUsed(true);
        tokenRepository.save(evt);

        return ResponseEntity.ok(Map.of("message", "Email verified. You can now log in."));
    }

   @PostMapping("/login")
public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req, HttpServletResponse res) {
    try {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail().toLowerCase(), req.getPassword()));

        var user = userRepository.findByEmail(req.getEmail().toLowerCase()).orElseThrow();
        var roles = user.getRoles().stream().map(Role::getName).toList();

        String accessToken = jwtService.generateAccessToken(user.getEmail(), roles);
        String refreshToken = jwtService.generateRefreshToken(user.getEmail(), roles);

        Cookie cookie = new Cookie("refresh_token", refreshToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(true); // bắt buộc nếu chạy HTTPS
        cookie.setPath("/");
        cookie.setMaxAge(7 * 24 * 60 * 60); // 7 ngày
        cookie.setAttribute("SameSite", "None"); // Java 11+, hoặc dùng res.addHeader

        res.addCookie(cookie);

        return ResponseEntity.ok(
                new AuthResponse("Bearer", accessToken, jwtService.getAccessTokenValiditySeconds()));
    } catch (BadCredentialsException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid email or password"));
    } catch (DisabledException e) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "Account disabled or not verified"));
    }
}


    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(
            @CookieValue(name = "refresh_token", required = false) String refreshToken) {

        if (refreshToken == null || !jwtService.isTokenValid(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid token"));
        }

        String email = jwtService.getUsername(refreshToken);
        var user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid token"));
        }

        var roles = user.getRoles().stream().map(Role::getName).toList();
        String newAccess = jwtService.generateAccessToken(user.getEmail(), roles);

        return ResponseEntity.ok(
                new AuthResponse("Bearer", newAccess, jwtService.getAccessTokenValiditySeconds()));
    }
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse res){
    	Cookie cookie = new Cookie("refresh_token", "");
    	cookie.setHttpOnly(true);
    	cookie.setPath("/auth/refresh");
    	cookie.setMaxAge(0);
    	res.addCookie(cookie);
        return ResponseEntity.ok(Map.of("message", "Logged out"));
    }
    
   
    @PostMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> changePassword(Authentication authentication, @Valid @RequestBody ChangePasswordRequest changePasswordRequest){
    	String email = authentication.getName();
    	var user = userRepository.findByEmail(email.toLowerCase()).orElse(null);
    	 if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "User not found"));

         if (!passwordEncoder.matches(changePasswordRequest.getCurrentPassword(), user.getPassword())) {
             return ResponseEntity.badRequest().body(Map.of("message", "Current password incorrect"));
         }
         if (passwordEncoder.matches(changePasswordRequest.getNewPassword(), user.getPassword())) {
             return ResponseEntity.badRequest().body(Map.of("message", "New password must be different"));
         }
         user.setPassword(passwordEncoder.encode(changePasswordRequest.getNewPassword()));
         userRepository.save(user);
         return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }
    
    
}
