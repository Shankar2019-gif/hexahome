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

    @Value("${hexahome.admin.bootstrap.username:}")
    private String bootstrapUsername;

    @Value("${hexahome.admin.bootstrap.password:}")
    private String bootstrapPassword;

    @Value("${hexahome.admin.bootstrap.email:}")
    private String bootstrapEmail;

    public AdminBootstrapRunner(
            AdminUserRepository adminUserRepository,
            PasswordEncoder passwordEncoder) {
        this.adminUserRepository = adminUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (adminUserRepository.count() == 0) {
            if (bootstrapUsername != null && !bootstrapUsername.isBlank()
                    && bootstrapPassword != null && !bootstrapPassword.isBlank()) {
                
                String email = (bootstrapEmail != null && !bootstrapEmail.isBlank())
                        ? bootstrapEmail
                        : bootstrapUsername + "@hexahome.in";

                AdminUser superAdmin = new AdminUser(
                        bootstrapUsername.trim(),
                        email.trim(),
                        passwordEncoder.encode(bootstrapPassword),
                        "Super Administrator",
                        "SUPER_ADMIN"
                );

                adminUserRepository.save(superAdmin);
                log.info("Bootstrap: Initial SUPER_ADMIN account successfully created for username: {}", bootstrapUsername);
            } else {
                log.info("Bootstrap: Zero admin accounts registered. Set HEXAHOME_ADMIN_BOOTSTRAP_USERNAME and HEXAHOME_ADMIN_BOOTSTRAP_PASSWORD environment variables to bootstrap initial super admin.");
            }
        }
    }
}
