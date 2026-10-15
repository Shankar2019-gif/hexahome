package com.hexahome;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.data.web.config.EnableSpringDataWebSupport;

@SpringBootApplication
@EnableSpringDataWebSupport(pageSerializationMode = EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO)
public class HexaHomeApplication {

    public static void main(String[] args) {
        configureDatabaseUrl();
        SpringApplication.run(HexaHomeApplication.class, args);
    }

    private static void configureDatabaseUrl() {
        String dbUrl = System.getenv("DATABASE_URL");
        if (dbUrl == null || dbUrl.isBlank()) {
            dbUrl = System.getenv("SPRING_DATASOURCE_URL");
        }
        if (dbUrl != null && (dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://"))) {
            try {
                String withoutScheme = dbUrl.replaceFirst("^postgres(ql)?://", "");
                int atIdx = withoutScheme.lastIndexOf('@');
                if (atIdx != -1) {
                    String userPass = withoutScheme.substring(0, atIdx);
                    String hostRest = withoutScheme.substring(atIdx + 1);

                    int colonIdx = userPass.indexOf(':');
                    if (colonIdx != -1) {
                        String user = userPass.substring(0, colonIdx);
                        String pass = userPass.substring(colonIdx + 1);
                        System.setProperty("spring.datasource.username", user);
                        System.setProperty("spring.datasource.password", pass);
                    } else {
                        System.setProperty("spring.datasource.username", userPass);
                    }

                    String ssl = hostRest.contains("?") ? "" : (hostRest.contains("render.com") ? "?sslmode=require" : "");
                    String jdbcUrl = "jdbc:postgresql://" + hostRest + ssl;
                    System.setProperty("spring.datasource.url", jdbcUrl);
                }
            } catch (Exception ignored) {
            }
        }
    }
}
