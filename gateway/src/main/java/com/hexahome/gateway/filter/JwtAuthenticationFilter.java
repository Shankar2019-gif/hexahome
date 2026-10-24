package com.hexahome.gateway.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * Edge JWT Authentication Filter.
 * - Extracts and validates JWT tokens on API requests.
 * - Enriches downstream request headers with X-Auth-User-Id, X-Auth-User-Roles, X-Auth-User-Email.
 * - Rejects unauthorized requests early to protect internal microservices.
 */
@Component
public class JwtAuthenticationFilter implements GlobalFilter, Ordered {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final SecretKey signingKey;

    private static final List<String> EXACT_PUBLIC_PATHS = List.of(
            "/api/v1/auth/login",
            "/api/v1/auth/register",
            "/api/v1/auth/refresh",
            "/api/admin/auth/login",
            "/api/admin/auth/refresh",
            "/api/admin/auth/logout",
            "/api/v1/health",
            "/api/v1/payments/webhook"
    );

    private static final List<String> PUBLIC_PATH_PREFIXES = List.of(
            "/api/v1/projects",
            "/api/v1/cities",
            "/api/v1/meta",
            "/api/v1/plans",
            "/api/v1/faqs",
            "/uploads/",
            "/swagger-ui",
            "/v3/api-docs",
            "/api-docs",
            "/actuator"
    );

    public JwtAuthenticationFilter(
            @Value("${hexahome.jwt.secret}") String secret) {
        if (secret == null || secret.trim().isEmpty()) {
            throw new IllegalStateException("JWT secret configuration 'hexahome.jwt.secret' must be provided");
        }
        if (secret.length() < 32) {
            secret = String.format("%-32s", secret).replace(' ', '0');
        }
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getRawPath();

        String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

        // If no token is provided
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            if (isPublicEndpoint(path, request.getMethod().name())) {
                return chain.filter(exchange);
            }
            log.warn("[GATEWAY-AUTH] Missing Bearer token on protected route: {}", path);
            return onError(exchange, HttpStatus.UNAUTHORIZED, "Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);

        try {
            Claims claims = Jwts.parser()
                    .verifyWith(signingKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            String subject = claims.getSubject();
            Object rolesObj = claims.get("roles");
            String roles = rolesObj != null ? rolesObj.toString() : "";
            String email = claims.get("email", String.class);
            if (email == null) {
                email = claims.get("phone", String.class);
            }

            // Propagate verified identity headers to downstream microservices
            ServerHttpRequest mutatedRequest = request.mutate()
                    .header("X-Auth-User-Id", subject != null ? subject : "")
                    .header("X-Auth-User-Roles", roles)
                    .header("X-Auth-User-Email", email != null ? email : "")
                    .build();

            return chain.filter(exchange.mutate().request(mutatedRequest).build());

        } catch (JwtException e) {
            log.warn("[GATEWAY-AUTH] Invalid JWT token for route {}: {}", path, e.getMessage());
            return onError(exchange, HttpStatus.UNAUTHORIZED, "Invalid or expired JWT token: " + e.getMessage());
        } catch (Exception e) {
            log.error("[GATEWAY-AUTH] Error processing authentication: {}", e.getMessage());
            return onError(exchange, HttpStatus.INTERNAL_SERVER_ERROR, "Authentication processing error");
        }
    }

    private boolean isPublicEndpoint(String path, String method) {
        if (EXACT_PUBLIC_PATHS.contains(path)) {
            return true;
        }
        for (String prefix : PUBLIC_PATH_PREFIXES) {
            if (path.startsWith(prefix)) {
                return true;
            }
        }
        // Public Property search and catalog endpoints (GET /api/v1/properties/**)
        if ("GET".equalsIgnoreCase(method) && path.startsWith("/api/v1/properties")) {
            return true;
        }
        // Public Lead submissions (POST /api/v1/leads, POST /api/v1/reports)
        if ("POST".equalsIgnoreCase(method) && (path.equals("/api/v1/leads") || path.equals("/api/v1/reports"))) {
            return true;
        }
        return false;
    }

    private Mono<Void> onError(ServerWebExchange exchange, HttpStatus status, String message) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(status);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);

        String jsonResponse = String.format(
                "{\"success\":false,\"message\":\"%s\",\"data\":null,\"timestamp\":\"%s\"}",
                message, java.time.Instant.now()
        );

        byte[] bytes = jsonResponse.getBytes(StandardCharsets.UTF_8);
        DataBuffer buffer = response.bufferFactory().wrap(bytes);
        return response.writeWith(Mono.just(buffer));
    }

    @Override
    public int getOrder() {
        return -1; // Execute right after logging filter
    }
}
