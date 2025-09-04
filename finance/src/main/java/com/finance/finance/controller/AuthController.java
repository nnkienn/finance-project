package com.finance.finance.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.finance.finance.dto.AuthResponse;
import com.finance.finance.dto.LoginRequest;
import com.finance.finance.dto.RegisterRequest;
import com.finance.finance.entity.EmailVerificationToken;
import com.finance.finance.entity.Role;
import com.finance.finance.entity.User;
import com.finance.finance.repository.EmailVerificationTokenRepository;
import com.finance.finance.repository.RoleRepositories;
import com.finance.finance.repository.UserRepositories;
import com.finance.finance.service.JwtService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
public class AuthController {
	private final AuthenticationManager authenticationManager;
	private final JwtService jwtService;
	private final UserRepositories userRepository;
	private final RoleRepositories roleRepository;
	private final EmailVerificationTokenRepository tokenRepository;
	private final PasswordEncoder passwordEncoder;

	@Value("${app.verification.expire-minutes:60}")
	private long verificationExpireMinutes;

	public AuthController(AuthenticationManager authenticationManager, JwtService jwtService,
			UserRepositories userRepository, RoleRepositories roleRepository,
			EmailVerificationTokenRepository tokenRepository, PasswordEncoder passwordEncoder) {
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

		Role roleUser = roleRepository.findByName("ROLE_USER")
				.orElseGet(() -> roleRepository.save(new Role(null, "ROLE_USER")));
		// ✅ mutable set
		user.setRoles(new java.util.HashSet<>(java.util.List.of(roleUser)));
		userRepository.save(user);

		String token = UUID.randomUUID().toString().replace("-", "");
		LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(verificationExpireMinutes);
	    EmailVerificationToken evt = new EmailVerificationToken(token, user, expiresAt);

		tokenRepository.save(evt);

		String verifyUrl = "/auth/verify?token=" + token;
		return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Registered. Please verify your email.",
				"verifyToken", token, "verifyUrl", verifyUrl));
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
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail().toLowerCase(), req.getPassword()));

        var user = userRepository.findByEmail(req.getEmail().toLowerCase()).orElseThrow();
        var roles = user.getRoles().stream().map(Role::getName).toList();
        String accessToken = jwtService.generateAccessToken(user.getEmail(), roles);
        String refreshToken = jwtService.generateRefreshToken(user.getEmail(), roles);

        Cookie cookie = new Cookie("refresh_token", refreshToken);
        cookie.setHttpOnly(true);
        cookie.setPath("/auth/refresh");
        res.addCookie(cookie);

        return ResponseEntity.ok(
        	    new AuthResponse("Bearer", accessToken, jwtService.getAccessTokenValiditySeconds())
        	);
    }

}
