package com.hexahome.application.service;

import com.hexahome.application.dto.admin.dashboard.AdminDashboardStatsDto;
import com.hexahome.persistence.entity.AdminAuditLog;
import com.hexahome.persistence.entity.AdminUser;
import com.hexahome.persistence.repository.AdminAuditLogRepository;
import com.hexahome.persistence.repository.LeadRepository;
import com.hexahome.persistence.repository.PropertyRepository;
import com.hexahome.persistence.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Collections;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminDashboardServiceTest {

    @Mock
    private PropertyRepository propertyRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private LeadRepository leadRepository;

    @Mock
    private AdminAuditLogRepository adminAuditLogRepository;

    private AdminDashboardService adminDashboardService;

    @BeforeEach
    void setUp() {
        adminDashboardService = new AdminDashboardService(
                propertyRepository,
                userRepository,
                leadRepository,
                adminAuditLogRepository
        );
    }

    @Test
    void getDashboardMetrics_Success() {
        when(propertyRepository.count()).thenReturn(150L);
        when(propertyRepository.countByStatus("PENDING_VERIFICATION")).thenReturn(25L);
        when(propertyRepository.countByStatus("ACTIVE")).thenReturn(120L);
        when(propertyRepository.countByStatus("REJECTED")).thenReturn(5L);

        when(userRepository.count()).thenReturn(500L);
        when(leadRepository.count()).thenReturn(80L);

        AdminUser admin = new AdminUser("superadmin", "admin@hexahome.in", "pass", "Super Admin", "SUPER_ADMIN");
        admin.setId(UUID.randomUUID());

        AdminAuditLog auditLog = new AdminAuditLog(
                admin,
                "APPROVE_LISTING",
                "Property",
                "prop-123",
                null,
                null,
                "Verified documentation",
                "127.0.0.1",
                "SUCCESS"
        );
        auditLog.setId(UUID.randomUUID());

        when(adminAuditLogRepository.findTop10ByOrderByCreatedAtDesc()).thenReturn(Collections.singletonList(auditLog));

        AdminDashboardStatsDto result = adminDashboardService.getDashboardMetrics();

        assertNotNull(result);
        assertEquals(150L, result.getTotalListings());
        assertEquals(25L, result.getPendingListings());
        assertEquals(120L, result.getActiveListings());
        assertEquals(5L, result.getRejectedListings());
        assertEquals(500L, result.getTotalUsers());
        assertEquals(80L, result.getTotalLeads());

        assertEquals(1, result.getRecentActivities().size());
        assertEquals("superadmin", result.getRecentActivities().get(0).getAdminUsername());
        assertEquals("APPROVE_LISTING", result.getRecentActivities().get(0).getAction());
        assertEquals("SUCCESS", result.getRecentActivities().get(0).getOutcome());
    }
}
