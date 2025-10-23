package com.finance.config;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.ForwardedHeaderFilter;

import com.finance.auth.service.CustomUserDetailsService;
import org.springframework.security.access.hierarchicalroles.RoleHierarchy;
import org.springframework.security.access.hierarchicalroles.RoleHierarchyAuthoritiesMapper;
import org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl;
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper;

@Configuration
@EnableMethodSecurity(prePostEnabled = true, securedEnabled = true, jsr250Enabled = true)
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(CustomUserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    // ⬇️ Đọc danh sách origin từ ENV / application-*.yml (phân tách bằng dấu phẩy)
    @Value("${app.cors.allowed-origins:*}")
    private String allowedOriginsCsv;

    @Bean
    public RoleHierarchy roleHierarchy() {
        RoleHierarchyImpl rh = new RoleHierarchyImpl();
        rh.setHierarchy("ROLE_ADMIN > ROLE_USER");
        return rh;
    }

    @Bean
    public GrantedAuthoritiesMapper authoritiesMapper(RoleHierarchy roleHierarchy) {
        return new RoleHierarchyAuthoritiesMapper(roleHierarchy);
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter(JwtService jwtService, RoleHierarchy roleHierarchy) {
        return new JwtAuthenticationFilter(jwtService, roleHierarchy, userDetailsService);
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider(GrantedAuthoritiesMapper authoritiesMapper) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        provider.setAuthoritiesMapper(authoritiesMapper);
        return provider;
    }

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http,
            JwtAuthenticationFilter jwtAuthenticationFilter,
            DaoAuthenticationProvider authenticationProvider) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // preflight
                // Auth
                .requestMatchers(HttpMethod.POST, "/auth/register", "/auth/login", "/auth/refresh").permitAll()
                .requestMatchers(HttpMethod.GET, "/auth/verify").permitAll()
                // WebSocket/SockJS
                .requestMatchers("/ws/**").permitAll()
                // Swagger (nếu cần dùng ở prod thì để, không thì bỏ)
                .requestMatchers(
                    "/v3/api-docs/**",
                    "/swagger-ui/**",
                    "/swagger-ui.html"
                ).permitAll()
                // Actuator: chỉ mở health/info
                .requestMatchers("/actuator/health/**", "/actuator/info").permitAll()
                // H2-console: chỉ dev, KHÔNG nên mở prod. Có thể để lại nhưng ràng buộc bằng profile.
                .requestMatchers("/h2-console/**").denyAll()
                // Trang root
                .requestMatchers(HttpMethod.GET, "/").permitAll()
                // Admin
                .requestMatchers("/admin/**").hasRole("ADMIN")
                // Còn lại bắt buộc có JWT
                .anyRequest().authenticated()
            )
            .headers(headers -> headers
                .frameOptions(frame -> frame.sameOrigin()) // để không lỗi iframe (chỉ cần cho H2/dev)
            )
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((req, res, e) -> {
                    res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    res.setContentType("application/json");
                    res.getWriter().write("{\"message\":\"Unauthorized\"}");
                })
                .accessDeniedHandler((req, res, e) -> {
                    res.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    res.setContentType("application/json");
                    res.getWriter().write("{\"message\":\"Forbidden\"}");
                })
            );

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // ✅ CORS đọc từ ENV: app.cors.allowed-origins
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        List<String> origins = Arrays.stream(allowedOriginsCsv.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());

        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowCredentials(true);
        // Dùng AllowedOriginPatterns để chấp nhận wildcard (http://localhost:*)
        configuration.setAllowedOriginPatterns(origins);
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setExposedHeaders(List.of("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // ✅ Để Spring tin tưởng X-Forwarded-* khi chạy sau ALB/Nginx
    @Bean
    public ForwardedHeaderFilter forwardedHeaderFilter() {
        return new ForwardedHeaderFilter();
    }
}
