package com.hexahome.application.service;

import com.hexahome.application.dto.admin.auth.AdminLoginRequest;
import com.hexahome.application.dto.admin.auth.AdminLoginResponse;
import com.hexahome.application.port.out.AuditLogPort;
import com.hexahome.domain.exception.ForbiddenException;
import com.hexahome.domain.exception.UnauthorizedException;
import com.hexahome.infrastructure.security.JwtService;
import com.hexahome.persistence.entity.AdminRefreshToken;
import com.hexahome.persistence.entity.AdminUser;
import com.hexahome.persistence.repository.AdminRefreshTokenRepository;
import com.hexahome.persistence.repository.AdminUserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminAuthServiceTest {

    @Mock
    private AdminUserRepository adminUserRepository;

    @Mock
    private AdminRefreshTokenRepository adminRefreshTokenRepository;

    @Mock
    private JwtService jwtService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuditLogPort auditLogPort;

    private AdminAuthService adminAuthService;
    private AdminUser testAdmin;

    @BeforeEach
    void setUp() {
        adminAuthService = new AdminAuthService(
                adminUserRepository,
                adminRefreshTokenRepository,
                jwtService,
                passwordEncoder,
                auditLogPort
        );

        testAdmin = new AdminUser("admin", "admin@hexahome.in", "encodedPass", "Admin User", "SUPER_ADMIN");
        testAdmin.setId(UUID.randomUUID());
    }

    @Test
    void login_Success() {
        AdminLoginRequest request = new AdminLoginRequest("admin", "correctPassword");

        when(adminUserRepository.findByUsernameOrEmail("admin", "admin")).thenReturn(Optional.of(testAdmin));
        when(passwordEncoder.matches("correctPassword", "encodedPass")).thenReturn(true);
        when(jwtService.generateAdminAccessToken(any(), any(), any())).thenReturn("mock.access.token");
        when(jwtService.getAccessExpirationMs()).thenReturn(900000L);
        when(jwtService.getRefreshExpirationMs()).thenReturn(604800000L);

        AdminLoginResponse response = adminAuthService.login(request, "127.0.0.1");

        assertNotNull(response);
        assertEquals("mock.access.token", response.getAccessToken());
        assertNotNull(response.getRefreshToken());
        assertEquals("SUPER_ADMIN", response.getUser().getRole());

        verify(adminRefreshTokenRepository).save(any(AdminRefreshToken.class));
        verify(auditLogPort).recordAction(eq(testAdmin.getId()), eq("ADMIN_LOGIN_SUCCESS"), any(), any(), any(), any(), any(), eq("127.0.0.1"), eq("SUCCESS"));
    }

    @Test
    void login_BadCredentials_IncrementsFailedAttempts() {
        AdminLoginRequest request = new AdminLoginRequest("admin", "wrongPassword");

        when(adminUserRepository.findByUsernameOrEmail("admin", "admin")).thenReturn(Optional.of(testAdmin));
        when(passwordEncoder.matches("wrongPassword", "encodedPass")).thenReturn(false);

        assertThrows(BadCredentialsException.class, () -> adminAuthService.login(request, "127.0.0.1"));

        assertEquals(1, testAdmin.getFailedLoginAttempts());
        verify(adminUserRepository).save(testAdmin);
        verify(auditLogPort).recordAction(eq(testAdmin.getId()), eq("ADMIN_LOGIN_FAILED"), any(), any(), any(), any(), any(), eq("127.0.0.1"), eq("FAILURE"));
    }

    @Test
    void login_LockedAccount_ThrowsForbiddenException() {
        testAdmin.setLockedUntil(Instant.now().plusSeconds(600));
        AdminLoginRequest request = new AdminLoginRequest("admin", "password");

        when(adminUserRepository.findByUsernameOrEmail("admin", "admin")).thenReturn(Optional.of(testAdmin));

        assertThrows(ForbiddenException.class, () -> adminAuthService.login(request, "127.0.0.1"));
    }

    @Test
    void refresh_RevokedTokenReused_TriggersSecurityRevocation() {
        AdminRefreshToken revokedToken = new AdminRefreshToken(testAdmin, "hash", Instant.now().plusSeconds(3600));
        revokedToken.setRevoked(true);

        when(adminRefreshTokenRepository.findByTokenHash(anyString())).thenReturn(Optional.of(revokedToken));

        assertThrows(UnauthorizedException.class, () -> adminAuthService.refresh("someRawToken", "127.0.0.1"));

        verify(adminRefreshTokenRepository).revokeAllByAdminId(testAdmin.getId());
        verify(auditLogPort).recordAction(eq(testAdmin.getId()), eq("TOKEN_REUSE_DETECTED"), any(), any(), any(), any(), any(), eq("127.0.0.1"), eq("SECURITY_ALERT"));
    }
}
