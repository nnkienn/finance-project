package com.finance.config;

import java.io.IOException;
import java.util.Collection;
import org.springframework.http.HttpHeaders;
import org.springframework.security.access.hierarchicalroles.RoleHierarchy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final RoleHierarchy roleHierarchy;

    public JwtAuthenticationFilter(JwtService jwtService, RoleHierarchy roleHierarchy) {
        this.jwtService = jwtService;
        this.roleHierarchy = roleHierarchy;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            try {
                // ✅ NOTE: Kiểm tra token hợp lệ
                if (jwtService.isTokenValid(token)) {
                    String username = jwtService.getUsername(token);
                    var authorities = jwtService.getRoles(token).stream()
                            .map(SimpleGrantedAuthority::new)
                            .toList();

                    Collection<? extends GrantedAuthority> reachable =
                            roleHierarchy.getReachableGrantedAuthorities(authorities);

                    var auth = new UsernamePasswordAuthenticationToken(username, null, reachable);
                    SecurityContextHolder.getContext().setAuthentication(auth);

                    System.out.println("✅ TOKEN_OK for user: " + username);
                }

            } catch (ExpiredJwtException ex) {
                // ✅ NOTE: Khi token hết hạn → trả về 401 để FE auto refresh
                System.out.println("⚠️ TOKEN_EXPIRED at: " + ex.getClaims().getExpiration());
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"message\":\"Access token expired\"}");
                return; // stop filter chain

            } catch (JwtException ex) {
                // ✅ NOTE: Token sai, signature không khớp, hoặc không parse được → cũng trả 401
                System.out.println("❌ TOKEN_INVALID: " + ex.getMessage());
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"message\":\"Invalid token\"}");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        return path.startsWith("/auth/") || path.startsWith("/h2-console/");
    }
}
