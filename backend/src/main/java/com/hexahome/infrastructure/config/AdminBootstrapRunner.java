package com.hexahome.infrastructure.config;

import com.hexahome.persistence.entity.AdminUser;
import com.hexahome.persistence.repository.AdminUserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminBootstrapRunner implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminBootstrapRunner.class);

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${hexahome.admin.bootstrap.username:${ADMIN_USERNAME:admin}}")
    private String bootstrapUsername;

    @Value("${hexahome.admin.bootstrap.password:${ADMIN_PASSWORD:HexaAdmin#2026!Secure}}")
    private String bootstrapPassword;

    @Value("${hexahome.admin.bootstrap.email:${ADMIN_EMAIL:admin@hexahome.in}}")
    private String bootstrapEmail;

    public AdminBootstrapRunner(
            AdminUserRepository adminUserRepository,
            PasswordEncoder passwordEncoder) {
        this.adminUserRepository = adminUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        String username = (bootstrapUsername != null && !bootstrapUsername.isBlank())
                ? bootstrapUsername.trim()
                : "admin";
        String password = (bootstrapPassword != null && !bootstrapPassword.isBlank())
                ? bootstrapPassword.trim()
                : "HexaAdmin#2026!Secure";
        String email = (bootstrapEmail != null && !bootstrapEmail.isBlank())
                ? bootstrapEmail.trim()
                : "admin@hexahome.in";

        adminUserRepository.findByUsernameOrEmail(username, email).ifPresentOrElse(
                admin -> {
                    // Ensure the account is unlocked, active, and synced
                    admin.setPasswordHash(passwordEncoder.encode(password));
                    admin.setActive(true);
                    admin.setFailedLoginAttempts(0);
                    admin.setLockedUntil(null);
                    admin.setRole("SUPER_ADMIN");
                    adminUserRepository.save(admin);
                    log.info("Bootstrap: Verified and synchronized SUPER_ADMIN account credentials for username: {}", username);
                },
                () -> {
                    AdminUser superAdmin = new AdminUser(
                            username,
                            email,
                            passwordEncoder.encode(password),
                            "HexaHome Super Administrator",
                            "SUPER_ADMIN"
                    );
                    adminUserRepository.save(superAdmin);
                    log.info("Bootstrap: Initial SUPER_ADMIN account successfully created for username: {}", username);
                }
        );
    }
}
