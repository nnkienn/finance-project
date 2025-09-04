package com.finance.finance.service;

import java.security.Key;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;

import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
public class JwtService {
	 private final Key key;
	    private final long accessTokenValidityMillis;
	    private final long refreshTokenValidityMillis;

	    public JwtService(
	            @Value("${app.jwt.base64-secret}") String base64Secret,
	            @Value("${app.jwt.access-token-validity-seconds}") long accessTokenValiditySeconds,
	            @Value("${app.jwt.refresh-token-validity-seconds}") long refreshTokenValiditySeconds) {
	        this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(base64Secret));
	        this.accessTokenValidityMillis = accessTokenValiditySeconds * 1000L;
	        this.refreshTokenValidityMillis = refreshTokenValiditySeconds * 1000L;
	    }
	    
	    public String generateAccessToken(String subject,List<String> roles) {
	    	return buildToken(subject, roles, accessTokenValidityMillis);
	    }
	    public String generateRefreshToken(String subject, List<String> roles) {
	    	return buildToken(subject, roles, refreshTokenValidityMillis);
	    }
	    
	    private String buildToken(String subject,List<String> roles, long validityMillis) {
	    	long now = System.currentTimeMillis();
	    	return Jwts.builder()
	    			.setSubject(subject)
	    			.addClaims(Map.of("roles",roles))
	    			.setIssuedAt(new Date(now))
	    			.setExpiration(new Date(now + validityMillis))
	    			.signWith(key,SignatureAlgorithm.HS256)
	    			.compact();
	    }
	    public boolean isTokenValid(String token) {
	    	try {
	    		parseClaims(token);
	    		return true;
			
			} catch (JwtException | IllegalArgumentException e) {
				// TODO: handle exception
				return false;
			}
	    }
	    
	    public Claims parseClaims(String token) {
	    	return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
	    }
	    
	    public String getUsername(String token) {
	    	return parseClaims(token).getSubject();
	    }
	    @SuppressWarnings("unchecked")
	    public List<String> getRoles(String token) {
	        return (List<String>) parseClaims(token).get("roles");
	    }

	    public long getAccessTokenValiditySeconds() {
	        return accessTokenValidityMillis / 1000L;
	    }
	    
	    
    
}
