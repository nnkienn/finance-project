package com.finance.auth.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.finance.auth.entity.User;
import com.finance.auth.repository.UserRepository;

@Component
public class SecurityUtils {
	private static UserRepository userRepository;

	public SecurityUtils(UserRepository userRepository) {
		SecurityUtils.userRepository = userRepository;
	}

	public static User getCurrentUser() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String email = authentication.getName();
		return userRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("User not found with email: " + email));
	}

	public static Long getCurrentUserId() {
		return getCurrentUser().getId();
	}
}
