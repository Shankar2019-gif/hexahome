package com.hexahome.gateway;

import com.hexahome.gateway.config.RateLimiterConfig;
import com.hexahome.gateway.filter.JwtAuthenticationFilter;
import com.hexahome.gateway.filter.LoggingFilter;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.mock.http.server.reactive.MockServerHttpRequest;
import org.springframework.mock.web.server.MockServerWebExchange;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicBoolean;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(classes = {
        GatewayApplication.class,
        RateLimiterConfig.class,
        LoggingFilter.class,
        JwtAuthenticationFilter.class
})
@ActiveProfiles("test")
class GatewayApplicationTests {

    private static final String TEST_SECRET = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    private SecretKey signingKey;

    @BeforeEach
    void setUp() {
        this.signingKey = Keys.hmacShaKeyFor(TEST_SECRET.getBytes(StandardCharsets.UTF_8));
    }

    @Test
    @DisplayName("Context loads successfully")
    void contextLoads() {
        assertNotNull(jwtAuthenticationFilter);
    }

    @Test
    @DisplayName("Public endpoint without token passes through successfully")
    void testPublicEndpointWithoutTokenPasses() {
        MockServerHttpRequest request = MockServerHttpRequest.get("/api/v1/health").build();
        MockServerWebExchange exchange = MockServerWebExchange.from(request);

        AtomicBoolean filterChainExecuted = new AtomicBoolean(false);
        GatewayFilterChain filterChain = filterExchange -> {
            filterChainExecuted.set(true);
            return Mono.empty();
        };

        StepVerifier.create(jwtAuthenticationFilter.filter(exchange, filterChain))
                .verifyComplete();

        assertTrue(filterChainExecuted.get(), "Public endpoint should invoke downstream filter chain");
        assertNull(exchange.getResponse().getStatusCode());
    }

    @Test
    @DisplayName("Protected endpoint without token returns 401 Unauthorized")
    void testProtectedEndpointWithoutTokenFails() {
        MockServerHttpRequest request = MockServerHttpRequest.get("/api/v1/auth/me").build();
        MockServerWebExchange exchange = MockServerWebExchange.from(request);

        AtomicBoolean filterChainExecuted = new AtomicBoolean(false);
        GatewayFilterChain filterChain = filterExchange -> {
            filterChainExecuted.set(true);
            return Mono.empty();
        };

        StepVerifier.create(jwtAuthenticationFilter.filter(exchange, filterChain))
                .verifyComplete();

        assertFalse(filterChainExecuted.get(), "Downstream chain should not be invoked on unauthorized request");
        assertEquals(HttpStatus.UNAUTHORIZED, exchange.getResponse().getStatusCode());
    }

    @Test
    @DisplayName("Protected endpoint with valid JWT token succeeds and propagates headers")
    void testProtectedEndpointWithValidTokenSucceeds() {
        UUID userId = UUID.randomUUID();
        String token = Jwts.builder()
                .subject(userId.toString())
                .claim("phone", "+919876543210")
                .claim("roles", List.of("ROLE_USER"))
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 60000))
                .signWith(signingKey)
                .compact();

        MockServerHttpRequest request = MockServerHttpRequest.get("/api/v1/auth/me")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .build();
        MockServerWebExchange exchange = MockServerWebExchange.from(request);

        AtomicBoolean filterChainExecuted = new AtomicBoolean(false);
        GatewayFilterChain filterChain = filterExchange -> {
            filterChainExecuted.set(true);
            // Verify enriched identity headers
            ServerWebExchange mutated = filterExchange;
            assertEquals(userId.toString(), mutated.getRequest().getHeaders().getFirst("X-Auth-User-Id"));
            assertEquals("+919876543210", mutated.getRequest().getHeaders().getFirst("X-Auth-User-Email"));
            return Mono.empty();
        };

        StepVerifier.create(jwtAuthenticationFilter.filter(exchange, filterChain))
                .verifyComplete();

        assertTrue(filterChainExecuted.get(), "Downstream chain should be invoked when token is valid");
    }

    @Test
    @DisplayName("Protected endpoint with invalid signature returns 401 Unauthorized")
    void testProtectedEndpointWithInvalidTokenFails() {
        String invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature";

        MockServerHttpRequest request = MockServerHttpRequest.get("/api/v1/auth/me")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + invalidToken)
                .build();
        MockServerWebExchange exchange = MockServerWebExchange.from(request);

        AtomicBoolean filterChainExecuted = new AtomicBoolean(false);
        GatewayFilterChain filterChain = filterExchange -> {
            filterChainExecuted.set(true);
            return Mono.empty();
        };

        StepVerifier.create(jwtAuthenticationFilter.filter(exchange, filterChain))
                .verifyComplete();

        assertFalse(filterChainExecuted.get());
        assertEquals(HttpStatus.UNAUTHORIZED, exchange.getResponse().getStatusCode());
    }
}
