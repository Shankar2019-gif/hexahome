package com.hexahome.application.service;

import com.hexahome.application.dto.admin.system.*;
import com.hexahome.application.port.out.AuditLogPort;
import com.hexahome.domain.exception.BadRequestException;
import com.hexahome.domain.exception.ResourceNotFoundException;
import com.hexahome.persistence.entity.AdminAuditLog;
import com.hexahome.persistence.entity.AdminUser;
import com.hexahome.persistence.repository.AdminAuditLogRepository;
import com.hexahome.persistence.repository.AdminUserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminSystemManagementServiceTest {

    @Mock
    private AdminAuditLogRepository auditLogRepository;

    @Mock
    private AdminUserRepository adminUserRepository;

    @Mock
    private AuditLogPort auditLogPort;

    @Mock
    private PasswordEncoder passwordEncoder;

    private AdminSystemManagementService systemService;

    private AdminUser testAdmin;
    private AdminAuditLog testLog;
    private UUID adminId;
    private UUID logId;

    @BeforeEach
    void setUp() {
        systemService = new AdminSystemManagementService(
                auditLogRepository,
                adminUserRepository,
                auditLogPort,
                passwordEncoder
        );

        adminId = UUID.randomUUID();
        logId = UUID.randomUUID();

        testAdmin = new AdminUser();
        testAdmin.setId(adminId);
        testAdmin.setUsername("superadmin");
        testAdmin.setEmail("super@hexahome.com");
        testAdmin.setFullName("Super Administrator");
        testAdmin.setRole("SUPER_ADMIN");
        testAdmin.setActive(true);
        testAdmin.setPasswordHash("hashed_pw");
        testAdmin.setCreatedAt(Instant.now());
        testAdmin.setUpdatedAt(Instant.now());

        testLog = new AdminAuditLog();
        testLog.setId(logId);
        testLog.setAdmin(testAdmin);
        testLog.setAction("APPROVE_LISTING");
        testLog.setEntityType("PROPERTY");
        testLog.setEntityId(UUID.randomUUID().toString());
        testLog.setPreviousValue("PENDING");
        testLog.setNewValue("ACTIVE");
        testLog.setReason("Verified property documents");
        testLog.setOutcome("SUCCESS");
        testLog.setCreatedAt(Instant.now());
    }

    @Test
    void searchAuditLogs_Success() {
        AdminAuditLogFilterRequest filter = new AdminAuditLogFilterRequest();
        filter.setPage(0);
        filter.setSize(10);

        Page<AdminAuditLog> page = new PageImpl<>(List.of(testLog));
        when(auditLogRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(page);

        Page<AdminAuditLogResponseDto> result = systemService.searchAuditLogs(filter);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        AdminAuditLogResponseDto dto = result.getContent().get(0);
        assertEquals(logId, dto.getId());
        assertEquals("APPROVE_LISTING", dto.getAction());
        assertEquals("superadmin", dto.getAdminUsername());
        assertEquals("SUCCESS", dto.getOutcome());
    }

    @Test
    void getAuditLogDetail_Success() {
        when(auditLogRepository.findById(logId)).thenReturn(Optional.of(testLog));

        AdminAuditLogResponseDto dto = systemService.getAuditLogDetail(logId);

        assertNotNull(dto);
        assertEquals(logId, dto.getId());
        assertEquals("APPROVE_LISTING", dto.getAction());
    }

    @Test
    void getAuditLogDetail_NotFound_ThrowsException() {
        when(auditLogRepository.findById(logId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> systemService.getAuditLogDetail(logId));
    }

    @Test
    void searchAdminUsers_Success() {
        Page<AdminUser> page = new PageImpl<>(List.of(testAdmin));
        when(adminUserRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(page);

        Page<AdminStaffDetailDto> result = systemService.searchAdminUsers(null, null, null, 0, 10);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("superadmin", result.getContent().get(0).getUsername());
    }

    @Test
    void createAdminUser_Success() {
        CreateAdminUserRequest req = new CreateAdminUserRequest();
        req.setUsername("moderator1");
        req.setEmail("mod1@hexahome.com");
        req.setFullName("Moderator One");
        req.setRole("MODERATOR");
        req.setTemporaryPassword("Password123!");

        when(adminUserRepository.existsByUsername("moderator1")).thenReturn(false);
        when(adminUserRepository.existsByEmail("mod1@hexahome.com")).thenReturn(false);
        when(passwordEncoder.encode("Password123!")).thenReturn("encoded_pw");

        AdminUser saved = new AdminUser();
        saved.setId(UUID.randomUUID());
        saved.setUsername("moderator1");
        saved.setEmail("mod1@hexahome.com");
        saved.setFullName("Moderator One");
        saved.setRole("MODERATOR");
        saved.setActive(true);
        when(adminUserRepository.save(any(AdminUser.class))).thenReturn(saved);

        AdminStaffDetailDto dto = systemService.createAdminUser(req, adminId, "127.0.0.1");

        assertNotNull(dto);
        assertEquals("moderator1", dto.getUsername());
        assertEquals("MODERATOR", dto.getRole());
        verify(auditLogPort).recordAction(
                eq(adminId),
                eq("CREATE_ADMIN_USER"),
                eq("ADMIN_USER"),
                eq(saved.getId().toString()),
                isNull(),
                eq("moderator1 (MODERATOR)"),
                eq("Provisioned admin account for Moderator One"),
                eq("127.0.0.1"),
                eq("SUCCESS")
        );
    }

    @Test
    void createAdminUser_DuplicateUsername_ThrowsBadRequestException() {
        CreateAdminUserRequest req = new CreateAdminUserRequest();
        req.setUsername("superadmin");
        req.setEmail("new@hexahome.com");
        req.setRole("SUPPORT");
        when(adminUserRepository.existsByUsername("superadmin")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> systemService.createAdminUser(req, adminId, "127.0.0.1"));
        verify(adminUserRepository, never()).save(any());
    }

    @Test
    void createAdminUser_InvalidRole_ThrowsBadRequestException() {
        CreateAdminUserRequest req = new CreateAdminUserRequest();
        req.setUsername("user1");
        req.setEmail("user1@hexahome.com");
        req.setRole("INVALID_ROLE");

        assertThrows(BadRequestException.class, () -> systemService.createAdminUser(req, adminId, "127.0.0.1"));
    }

    @Test
    void updateAdminUser_Success() {
        UpdateAdminUserRequest req = new UpdateAdminUserRequest();
        req.setFullName("Super Administrator Updated");
        req.setRole("SUPPORT");
        req.setIsActive(false);

        when(adminUserRepository.findById(adminId)).thenReturn(Optional.of(testAdmin));
        when(adminUserRepository.save(any(AdminUser.class))).thenReturn(testAdmin);

        AdminStaffDetailDto dto = systemService.updateAdminUser(adminId, req, adminId, "127.0.0.1");

        assertNotNull(dto);
        assertEquals("SUPPORT", testAdmin.getRole());
        assertFalse(testAdmin.isActive());
        verify(auditLogPort).recordAction(
                eq(adminId),
                eq("UPDATE_ADMIN_USER"),
                eq("ADMIN_USER"),
                eq(adminId.toString()),
                anyString(),
                anyString(),
                eq("Updated admin account parameters"),
                eq("127.0.0.1"),
                eq("SUCCESS")
        );
    }

    @Test
    void getSystemHealthMetrics_Success() {
        SystemHealthMetricsDto metrics = systemService.getSystemHealthMetrics();

        assertNotNull(metrics);
        assertTrue(metrics.getHeapMemoryMaxBytes() > 0);
        assertTrue(metrics.getAvailableProcessors() > 0);
        assertTrue(metrics.getLiveThreadCount() > 0);
        assertNotNull(metrics.getJavaVersion());
        assertNotNull(metrics.getOsName());
        assertNotNull(metrics.getTimestamp());
    }
}
