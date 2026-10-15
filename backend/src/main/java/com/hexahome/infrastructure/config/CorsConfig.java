package com.hexahome.infrastructure.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    @Value("${hexahome.cors.allowed-origins:http://localhost:8085,http://localhost:5173,http://localhost:3000,https://www.hexahome.in}")
    private List<String> allowedOrigins;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        List<String> patterns = new ArrayList<>();
        if (allowedOrigins != null) {
            patterns.addAll(allowedOrigins);
        }
        patterns.add("https://*.vercel.app");
        patterns.add("https://*.onrender.com");
        patterns.add("https://hexahome.vercel.app");
        patterns.add("https://hexahome.onrender.com");
        patterns.add("http://localhost:*");
        configuration.setAllowedOriginPatterns(patterns);

        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Disposition"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
