package com.hexahome.application.service;

import com.hexahome.application.dto.admin.auth.AdminLoginRequest;
import com.hexahome.application.dto.admin.auth.AdminLoginResponse;
import com.hexahome.application.dto.admin.auth.AdminUserSummaryDto;
import com.hexahome.application.port.in.AdminAuthUseCase;
import com.hexahome.application.port.out.AuditLogPort;
import com.hexahome.domain.exception.BadRequestException;
import com.hexahome.domain.exception.ForbiddenException;
import com.hexahome.domain.exception.ResourceNotFoundException;
import com.hexahome.domain.exception.UnauthorizedException;
import com.hexahome.infrastructure.security.JwtService;
import com.hexahome.persistence.entity.AdminRefreshToken;
import com.hexahome.persistence.entity.AdminUser;
import com.hexahome.persistence.repository.AdminRefreshTokenRepository;
import com.hexahome.persistence.repository.AdminUserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class AdminAuthService implements AdminAuthUseCase {

    private static final Logger log = LoggerFactory.getLogger(AdminAuthService.class);
    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final Duration LOCKOUT_DURATION = Duration.ofMinutes(15);

    private final AdminUserRepository adminUserRepository;
    private final AdminRefreshTokenRepository adminRefreshTokenRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogPort auditLogPort;

    public AdminAuthService(
            AdminUserRepository adminUserRepository,
            AdminRefreshTokenRepository adminRefreshTokenRepository,
            JwtService jwtService,
            PasswordEncoder passwordEncoder,
            AuditLogPort auditLogPort) {
        this.adminUserRepository = adminUserRepository;
        this.adminRefreshTokenRepository = adminRefreshTokenRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.auditLogPort = auditLogPort;
    }

    @Override
    @Transactional
    public AdminLoginResponse login(AdminLoginRequest request, String ipAddress) {
        String cleanIdentifier = request.getUsernameOrEmail().trim();

        Optional<AdminUser> adminOpt = adminUserRepository.findByUsernameOrEmail(cleanIdentifier, cleanIdentifier);
        if (adminOpt.isEmpty()) {
            auditLogPort.recordAction(
                    null,
                    "ADMIN_LOGIN_FAILED",
                    "AdminUser",
                    cleanIdentifier,
                    null,
                    null,
                    "Admin account not found",
                    ipAddress,
                    "FAILURE"
            );
            throw new BadCredentialsException("Invalid admin username or password");
        }

        AdminUser admin = adminOpt.get();

        if (!admin.isActive()) {
            auditLogPort.recordAction(
                    admin.getId(),
                    "ADMIN_LOGIN_BLOCKED",
                    "AdminUser",
                    admin.getId().toString(),
                    null,
                    null,
                    "Account is disabled",
                    ipAddress,
                    "FAILURE"
            );
            throw new ForbiddenException("Admin account is disabled");
        }

        if (admin.isAccountLocked()) {
            auditLogPort.recordAction(
                    admin.getId(),
                    "ADMIN_LOGIN_LOCKED",
                    "AdminUser",
                    admin.getId().toString(),
                    null,
                    null,
                    "Account locked until " + admin.getLockedUntil(),
                    ipAddress,
                    "FAILURE"
            );
            throw new ForbiddenException("Account is temporarily locked due to multiple failed attempts. Try again later.");
        }

        if (!passwordEncoder.matches(request.getPassword(), admin.getPasswordHash())) {
            int attempts = admin.getFailedLoginAttempts() + 1;
            admin.setFailedLoginAttempts(attempts);
            if (attempts >= MAX_FAILED_ATTEMPTS) {
                admin.setLockedUntil(Instant.now().plus(LOCKOUT_DURATION));
                log.warn("Admin account locked: username={} attempts={}", admin.getUsername(), attempts);
            }
            adminUserRepository.save(admin);

            auditLogPort.recordAction(
                    admin.getId(),
                    "ADMIN_LOGIN_FAILED",
                    "AdminUser",
                    admin.getId().toString(),
                    null,
                    null,
                    "Incorrect credentials. Attempt " + attempts + " of " + MAX_FAILED_ATTEMPTS,
                    ipAddress,
                    "FAILURE"
            );
            throw new BadCredentialsException("Invalid admin username or password");
        }

        // Login success: reset attempts and lock
        admin.setFailedLoginAttempts(0);
        admin.setLockedUntil(null);
        adminUserRepository.save(admin);

        String accessToken = jwtService.generateAdminAccessToken(admin.getId(), admin.getUsername(), admin.getRole());
        String rawRefreshToken = UUID.randomUUID().toString() + "-" + UUID.randomUUID().toString();
        String tokenHash = hashToken(rawRefreshToken);

        Instant expiresAt = Instant.now().plusMillis(jwtService.getRefreshExpirationMs());
        AdminRefreshToken refreshTokenEntity = new AdminRefreshToken(admin, tokenHash, expiresAt);
        adminRefreshTokenRepository.save(refreshTokenEntity);

        auditLogPort.recordAction(
                admin.getId(),
                "ADMIN_LOGIN_SUCCESS",
                "AdminUser",
                admin.getId().toString(),
                null,
                null,
                "Authentication successful",
                ipAddress,
                "SUCCESS"
        );

        AdminUserSummaryDto userSummary = new AdminUserSummaryDto(
                admin.getId(),
                admin.getUsername(),
                admin.getEmail(),
                admin.getFullName(),
                admin.getRole()
        );

        return new AdminLoginResponse(
                accessToken,
                rawRefreshToken,
                jwtService.getAccessExpirationMs() / 1000,
                userSummary
        );
    }

    @Override
    @Transactional
    public AdminLoginResponse refresh(String rawRefreshToken, String ipAddress) {
        if (rawRefreshToken == null || rawRefreshToken.isBlank()) {
            throw new BadRequestException("Refresh token is required");
        }

        String tokenHash = hashToken(rawRefreshToken);
        Optional<AdminRefreshToken> tokenOpt = adminRefreshTokenRepository.findByTokenHash(tokenHash);

        if (tokenOpt.isEmpty()) {
            throw new UnauthorizedException("Invalid refresh token. Please sign in again.");
        }

        AdminRefreshToken token = tokenOpt.get();
        AdminUser admin = token.getAdmin();

        if (token.isRevoked()) {
            // Potential token reuse attack: revoke all tokens for this admin
            adminRefreshTokenRepository.revokeAllByAdminId(admin.getId());
            auditLogPort.recordAction(
                    admin.getId(),
                    "TOKEN_REUSE_DETECTED",
                    "AdminRefreshToken",
                    token.getId() != null ? token.getId().toString() : "UNKNOWN",
                    null,
                    null,
                    "Revoked token presented. Invalidated all sessions.",
                    ipAddress,
                    "SECURITY_ALERT"
            );
            throw new UnauthorizedException("Session revoked due to security violation. Please log in again.");
        }

        if (token.isExpired()) {
            token.setRevoked(true);
            adminRefreshTokenRepository.save(token);
            throw new UnauthorizedException("Refresh token has expired. Please log in again.");
        }

        if (!admin.isActive() || admin.isAccountLocked()) {
            throw new ForbiddenException("Admin account is not active or is locked");
        }

        // Rotate token: revoke current token
        token.setRevoked(true);
        adminRefreshTokenRepository.save(token);

        // Issue new pair
        String newAccessToken = jwtService.generateAdminAccessToken(admin.getId(), admin.getUsername(), admin.getRole());
        String newRawRefreshToken = UUID.randomUUID().toString() + "-" + UUID.randomUUID().toString();
        String newTokenHash = hashToken(newRawRefreshToken);

        Instant expiresAt = Instant.now().plusMillis(jwtService.getRefreshExpirationMs());
        AdminRefreshToken newTokenEntity = new AdminRefreshToken(admin, newTokenHash, expiresAt);
        adminRefreshTokenRepository.save(newTokenEntity);

        AdminUserSummaryDto userSummary = new AdminUserSummaryDto(
                admin.getId(),
                admin.getUsername(),
                admin.getEmail(),
                admin.getFullName(),
                admin.getRole()
        );

        return new AdminLoginResponse(
                newAccessToken,
                newRawRefreshToken,
                jwtService.getAccessExpirationMs() / 1000,
                userSummary
        );
    }

    @Override
    @Transactional
    public void logout(String rawRefreshToken, UUID adminId) {
        if (rawRefreshToken != null && !rawRefreshToken.isBlank()) {
            String tokenHash = hashToken(rawRefreshToken);
            adminRefreshTokenRepository.findByTokenHash(tokenHash).ifPresent(token -> {
                token.setRevoked(true);
                adminRefreshTokenRepository.save(token);
            });
        }

        if (adminId != null) {
            adminRefreshTokenRepository.revokeAllByAdminId(adminId);
            auditLogPort.recordAction(
                    adminId,
                    "ADMIN_LOGOUT",
                    "AdminUser",
                    adminId.toString(),
                    null,
                    null,
                    "Admin logged out",
                    null,
                    "SUCCESS"
            );
        }
    }

    @Override
    @Transactional(readOnly = true)
    public AdminUserSummaryDto getCurrentAdmin(UUID adminId) {
        AdminUser admin = adminUserRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with ID: " + adminId));

        return new AdminUserSummaryDto(
                admin.getId(),
                admin.getUsername(),
                admin.getEmail(),
                admin.getFullName(),
                admin.getRole()
        );
    }

    private String hashToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }
}
