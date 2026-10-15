package com.hexahome.infrastructure.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class JwtService {

    private static final Logger log = LoggerFactory.getLogger(JwtService.class);

    private final SecretKey signingKey;
    private final long accessExpirationMs;
    private final long refreshExpirationMs;

    public JwtService(
            @Value("${hexahome.jwt.secret}") String secret,
            @Value("${hexahome.jwt.access-expiration-ms:900000}") long accessExpirationMs,
            @Value("${hexahome.jwt.refresh-expiration-ms:604800000}") long refreshExpirationMs) {

        if (secret == null || secret.trim().isEmpty()) {
            throw new IllegalStateException("JWT secret configuration 'hexahome.jwt.secret' must be provided");
        }

        byte[] keyBytes;
        if (secret.length() < 32) {
            secret = String.format("%-32s", secret).replace(' ', '0');
        }
        keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
        this.accessExpirationMs = accessExpirationMs;
        this.refreshExpirationMs = refreshExpirationMs;
    }

    public String generateAccessToken(UUID userId, String phone, Collection<String> roles) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + accessExpirationMs);

        return Jwts.builder()
                .subject(userId.toString())
                .claim("phone", phone)
                .claim("roles", new ArrayList<>(roles))
                .claim("type", "access")
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(signingKey)
                .compact();
    }

    public String generateRefreshToken(UUID userId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + refreshExpirationMs);

        return Jwts.builder()
                .subject(userId.toString())
                .claim("type", "refresh")
                .id(UUID.randomUUID().toString())
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(signingKey)
                .compact();
    }

    public Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean validateToken(String token) {
        try {
            Claims claims = extractClaims(token);
            return !claims.getExpiration().before(new Date());
        } catch (JwtException | IllegalArgumentException e) {
            log.warn("Invalid JWT token: {}", e.getMessage());
            return false;
        }
    }

    public UUID extractUserId(String token) {
        Claims claims = extractClaims(token);
        return UUID.fromString(claims.getSubject());
    }

    public String extractTokenType(String token) {
        Claims claims = extractClaims(token);
        return claims.get("type", String.class);
    }

    @SuppressWarnings("unchecked")
    public List<String> extractRoles(String token) {
        Claims claims = extractClaims(token);
        return claims.get("roles", List.class);
    }

    public String generateAdminAccessToken(UUID adminId, String username, String role) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + accessExpirationMs);

        String roleWithPrefix = role.startsWith("ROLE_") ? role : "ROLE_" + role;
        return Jwts.builder()
                .subject(adminId.toString())
                .claim("username", username)
                .claim("role", role)
                .claim("roles", Collections.singletonList(roleWithPrefix))
                .claim("userType", "ADMIN")
                .claim("type", "access")
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(signingKey)
                .compact();
    }

    public String extractUserType(String token) {
        Claims claims = extractClaims(token);
        return claims.get("userType", String.class);
    }

    public long getAccessExpirationMs() {
        return accessExpirationMs;
    }

    public long getRefreshExpirationMs() {
        return refreshExpirationMs;
    }
}
