package com.hexahome.infrastructure.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    private static final String SECURITY_SCHEME_NAME = "bearerAuth";

    @Bean
    public OpenAPI hexaHomeOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("HexaHome Real Estate Platform API")
                        .description("Production-grade REST API backend for HexaHome real-estate listing portal (Buy, Rent, Commercial, PG/Co-living, Projects, Inquiries, and Subscriptions).")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("HexaHome Engineering")
                                .email("support@hexahome.in")
                                .url("https://www.hexahome.in"))
                        .license(new License()
                                .name("Proprietary")
                                .url("https://www.hexahome.in/terms")))
                .servers(List.of(
                        new Server().url("http://localhost:8081").description("Local Development Server"),
                        new Server().url("https://api.hexahome.in").description("Production Server")
                ))
                .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME))
                .components(new Components()
                        .addSecuritySchemes(SECURITY_SCHEME_NAME, new SecurityScheme()
                                .name(SECURITY_SCHEME_NAME)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Enter JWT Bearer token obtained from /api/v1/auth/verify-otp or /api/v1/auth/login")));
    }
}
