package com.hexahome.gateway.config;

import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import reactor.core.publisher.Mono;

/**
 * Key resolver configuration for Redis Rate Limiter.
 * Uses authenticated User ID if available, otherwise falls back to client IP address.
 */
@Configuration
public class RateLimiterConfig {

    @Bean
    @Primary
    public KeyResolver userOrIpKeyResolver() {
        return exchange -> {
            // 1. Prefer authenticated user identifier
            String userId = exchange.getRequest().getHeaders().getFirst("X-Auth-User-Id");
            if (userId != null && !userId.isBlank()) {
                return Mono.just("user:" + userId);
            }

            // 2. Check X-Forwarded-For header for client IP behind proxies/Nginx
            String xForwardedFor = exchange.getRequest().getHeaders().getFirst("X-Forwarded-For");
            if (xForwardedFor != null && !xForwardedFor.isBlank()) {
                return Mono.just("ip:" + xForwardedFor.split(",")[0].trim());
            }

            // 3. Fallback to direct TCP remote address
            if (exchange.getRequest().getRemoteAddress() != null
                    && exchange.getRequest().getRemoteAddress().getAddress() != null) {
                return Mono.just("ip:" + exchange.getRequest().getRemoteAddress().getAddress().getHostAddress());
            }

            return Mono.just("ip:anonymous");
        };
    }
}
