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

import com.finance.auth.service.CustomUserDetailsService;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final RoleHierarchy roleHierarchy;
    private final CustomUserDetailsService userDetailsService; // ✅ inject

    public JwtAuthenticationFilter(JwtService jwtService,
                                   RoleHierarchy roleHierarchy,
                                   CustomUserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.roleHierarchy = roleHierarchy;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            try {
                if (jwtService.isTokenValid(token)) {
                    String username = jwtService.getUsername(token);

                    var authorities = jwtService.getRoles(token).stream()
                            .map(r -> r.startsWith("ROLE_") ? r : "ROLE_" + r) // ✅ chuẩn hoá ROLE_
                            .map(SimpleGrantedAuthority::new)
                            .toList();

                    Collection<? extends GrantedAuthority> reachable =
                            roleHierarchy.getReachableGrantedAuthorities(authorities);

                    // ✅ principal là UserDetails để SpEL/@AuthenticationPrincipal hoạt động
                    var userDetails = userDetailsService.loadUserByUsername(username);

                    var auth = new UsernamePasswordAuthenticationToken(userDetails, null, reachable);
                    SecurityContextHolder.getContext().setAuthentication(auth);

                    System.out.println("✅ TOKEN_OK user=" + username + " authorities=" + reachable);
                }

            } catch (ExpiredJwtException ex) {
                // ✅ Trả 401 để FE auto refresh
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"message\":\"Access token expired\"}");
                return;

            } catch (JwtException ex) {
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
