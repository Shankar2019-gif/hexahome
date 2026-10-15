package com.hexahome.gateway.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

/**
 * Global observability filter for tracking incoming HTTP requests,
 * client origin IPs, status codes, and execution latencies through the Gateway.
 */
@Component
public class LoggingFilter implements GlobalFilter, Ordered {

    private static final Logger log = LoggerFactory.getLogger(LoggingFilter.class);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        long startTime = System.currentTimeMillis();

        String path = request.getURI().getRawPath();
        String method = request.getMethod() != null ? request.getMethod().name() : "UNKNOWN";
        String remoteAddress = request.getRemoteAddress() != null && request.getRemoteAddress().getAddress() != null
                ? request.getRemoteAddress().getAddress().getHostAddress()
                : "unknown";

        log.info("[GATEWAY-IN]  {} {} from {}", method, path, remoteAddress);

        return chain.filter(exchange).then(Mono.fromRunnable(() -> {
            ServerHttpResponse response = exchange.getResponse();
            long duration = System.currentTimeMillis() - startTime;
            int statusCode = response.getStatusCode() != null ? response.getStatusCode().value() : 0;
            log.info("[GATEWAY-OUT] {} {} -> HTTP {} ({}ms)", method, path, statusCode, duration);
        }));
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE;
    }
}
