package com.hexahome.infrastructure.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hexahome.presentation.response.ErrorResponse;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.web.cors.CorsConfigurationSource;

import com.hexahome.infrastructure.security.JwtAuthenticationFilter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final CorsConfigurationSource corsConfigurationSource;
    private final ObjectMapper objectMapper;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            CorsConfigurationSource corsConfigurationSource,
            ObjectMapper objectMapper,
            JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.corsConfigurationSource = corsConfigurationSource;
        this.objectMapper = objectMapper;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint(customAuthenticationEntryPoint())
                        .accessDeniedHandler(customAccessDeniedHandler())
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/v1/health",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**",
                                "/api-docs/**",
                                "/api/v1/auth/login",
                                "/api/v1/auth/register",
                                "/api/v1/auth/refresh",
                                "/api/v1/projects/**",
                                "/api/v1/cities/**",
                                "/api/v1/meta/**",
                                "/api/v1/plans/**",
                                "/api/v1/faqs/**",
                                "/uploads/**",
                                "/api/admin/auth/login",
                                "/api/admin/auth/refresh",
                                "/api/admin/auth/logout",
                                "/api/v1/payments/webhook"
                        ).permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/v1/properties/my-properties").authenticated()
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/v1/properties/**").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/v1/leads", "/api/v1/reports").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/v1/leads/reveal-contact", "/api/v1/properties/*/reveal-contact").authenticated()
                        .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/v1/properties/**").authenticated()
                        .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/v1/properties/**").authenticated()
                        .requestMatchers(org.springframework.http.HttpMethod.PATCH, "/api/v1/properties/**").authenticated()
                        .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/v1/properties/**").authenticated()
                        .requestMatchers("/api/v1/media/**", "/api/v1/storage/**").authenticated()
                        .requestMatchers("/api/v1/auth/me", "/api/v1/leads/my-leads", "/api/v1/leads/my-inquiries", "/api/v1/wishlists/**", "/api/v1/subscriptions/**").authenticated()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationEntryPoint customAuthenticationEntryPoint() {
        return (request, response, authException) -> {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            ErrorResponse error = new ErrorResponse(
                    HttpStatus.UNAUTHORIZED.value(),
                    "Unauthorized",
                    "Full authentication is required to access this resource: " + authException.getMessage(),
                    request.getRequestURI()
            );
            response.getWriter().write(objectMapper.writeValueAsString(error));
        };
    }

    @Bean
    public AccessDeniedHandler customAccessDeniedHandler() {
        return (request, response, accessDeniedException) -> {
            response.setStatus(HttpStatus.FORBIDDEN.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            ErrorResponse error = new ErrorResponse(
                    HttpStatus.FORBIDDEN.value(),
                    "Forbidden",
                    "Access is denied: insufficient role or permissions",
                    request.getRequestURI()
            );
            response.getWriter().write(objectMapper.writeValueAsString(error));
        };
    }
}
