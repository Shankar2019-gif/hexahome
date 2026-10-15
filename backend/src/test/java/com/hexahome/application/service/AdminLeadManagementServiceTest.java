package com.hexahome.application.service;

import com.hexahome.application.dto.admin.lead.*;
import com.hexahome.application.port.out.AuditLogPort;
import com.hexahome.domain.exception.BadRequestException;
import com.hexahome.domain.exception.ResourceNotFoundException;
import com.hexahome.domain.policy.LeadLifecyclePolicy;
import com.hexahome.persistence.entity.AdminAuditLog;
import com.hexahome.persistence.entity.AdminUser;
import com.hexahome.persistence.entity.Lead;
import com.hexahome.persistence.entity.Property;
import com.hexahome.persistence.repository.AdminAuditLogRepository;
import com.hexahome.persistence.repository.AdminUserRepository;
import com.hexahome.persistence.repository.LeadRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminLeadManagementServiceTest {

    @Mock
    private LeadRepository leadRepository;

    @Mock
    private AdminUserRepository adminUserRepository;

    @Mock
    private AdminAuditLogRepository auditLogRepository;

    @Mock
    private AuditLogPort auditLogPort;

    private AdminLeadManagementService leadService;

    private Lead testLead;
    private Property testProperty;
    private AdminUser testAdmin;
    private UUID leadId;
    private UUID propertyId;
    private UUID adminId;

    @BeforeEach
    void setUp() {
        leadService = new AdminLeadManagementService(
                leadRepository,
                adminUserRepository,
                auditLogRepository,
                auditLogPort
        );

        leadId = UUID.randomUUID();
        propertyId = UUID.randomUUID();
        adminId = UUID.randomUUID();

        testProperty = new Property();
        testProperty.setId(propertyId);
        testProperty.setTitle("Luxury 3 BHK Villa");
        testProperty.setShortId("HEX789");

        testAdmin = new AdminUser();
        testAdmin.setId(adminId);
        testAdmin.setUsername("sales_rep1");
        testAdmin.setEmail("sales@hexahome.com");
        testAdmin.setFullName("Sales Representative");
        testAdmin.setRole("SALES");
        testAdmin.setActive(true);

        testLead = new Lead();
        testLead.setId(leadId);
        testLead.setProperty(testProperty);
        testLead.setSeekerName("Alice Smith");
        testLead.setSeekerPhone("9876543210");
        testLead.setMessage("Interested in scheduling a site visit");
        testLead.setStatus(LeadLifecyclePolicy.STATUS_NEW);
        testLead.setCreatedAt(Instant.now());
        testLead.setUpdatedAt(Instant.now());
    }

    @Test
    void searchLeads_Success() {
        AdminLeadFilterRequest request = new AdminLeadFilterRequest();
        request.setPage(0);
        request.setSize(10);

        Page<Lead> page = new PageImpl<>(List.of(testLead));
        when(leadRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(page);

        Page<AdminLeadSummaryDto> result = leadService.searchLeads(request);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        AdminLeadSummaryDto summary = result.getContent().get(0);
        assertEquals(leadId, summary.getId());
        assertEquals("Alice Smith", summary.getSeekerName());
        assertTrue(summary.getMaskedPhone().endsWith("3210"));
        assertTrue(summary.getMaskedPhone().startsWith("******"));
        assertEquals("Luxury 3 BHK Villa", summary.getPropertyTitle());
    }

    @Test
    void getLeadDetail_Success() {
        when(leadRepository.findById(leadId)).thenReturn(Optional.of(testLead));

        AdminLeadDetailDto detail = leadService.getLeadDetail(leadId);

        assertNotNull(detail);
        assertEquals(leadId, detail.getId());
        assertEquals("Alice Smith", detail.getSeekerName());
        assertTrue(detail.getMaskedPhone().endsWith("3210"));
        assertEquals("Interested in scheduling a site visit", detail.getMessage());
        assertEquals(LeadLifecyclePolicy.STATUS_NEW, detail.getStatus());
        assertEquals(propertyId, detail.getPropertyId());
    }

    @Test
    void getLeadDetail_NotFound_ThrowsException() {
        when(leadRepository.findById(leadId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> leadService.getLeadDetail(leadId));
    }

    @Test
    void assignLead_Success() {
        AssignLeadRequest request = new AssignLeadRequest(adminId, "Priority lead for South zone");
        when(leadRepository.findById(leadId)).thenReturn(Optional.of(testLead));
        when(adminUserRepository.findById(adminId)).thenReturn(Optional.of(testAdmin));

        leadService.assignLead(leadId, request, adminId, "127.0.0.1");

        assertEquals(testAdmin, testLead.getAssignedAdmin());
        assertNotNull(testLead.getAssignedAt());
        verify(leadRepository).save(testLead);
        verify(auditLogPort).recordAction(
                eq(adminId),
                eq("ASSIGN_LEAD"),
                eq("LEAD"),
                eq(leadId.toString()),
                eq("UNASSIGNED"),
                eq("sales_rep1"),
                eq("Priority lead for South zone"),
                eq("127.0.0.1"),
                eq("SUCCESS")
        );
    }

    @Test
    void assignLead_TargetAdminDisabled_ThrowsBadRequestException() {
        testAdmin.setActive(false);
        AssignLeadRequest request = new AssignLeadRequest(adminId, "Assignment note");
        when(leadRepository.findById(leadId)).thenReturn(Optional.of(testLead));
        when(adminUserRepository.findById(adminId)).thenReturn(Optional.of(testAdmin));

        assertThrows(BadRequestException.class, () -> leadService.assignLead(leadId, request, adminId, "127.0.0.1"));
        verify(leadRepository, never()).save(any());
    }

    @Test
    void assignLead_TargetAdminIneligibleRole_ThrowsBadRequestException() {
        testAdmin.setRole("CONTENT");
        AssignLeadRequest request = new AssignLeadRequest(adminId, "Assignment note");
        when(leadRepository.findById(leadId)).thenReturn(Optional.of(testLead));
        when(adminUserRepository.findById(adminId)).thenReturn(Optional.of(testAdmin));

        assertThrows(BadRequestException.class, () -> leadService.assignLead(leadId, request, adminId, "127.0.0.1"));
        verify(leadRepository, never()).save(any());
    }

    @Test
    void updateLeadStatus_Success() {
        UpdateLeadStatusRequest request = new UpdateLeadStatusRequest(LeadLifecyclePolicy.STATUS_CONTACTED, "Spoke with client on phone");
        when(leadRepository.findById(leadId)).thenReturn(Optional.of(testLead));

        leadService.updateLeadStatus(leadId, request, adminId, "127.0.0.1");

        assertEquals(LeadLifecyclePolicy.STATUS_CONTACTED, testLead.getStatus());
        verify(leadRepository).save(testLead);
        verify(auditLogPort).recordAction(
                eq(adminId),
                eq("UPDATE_LEAD_STATUS"),
                eq("LEAD"),
                eq(leadId.toString()),
                eq(LeadLifecyclePolicy.STATUS_NEW),
                eq(LeadLifecyclePolicy.STATUS_CONTACTED),
                eq("Spoke with client on phone"),
                eq("127.0.0.1"),
                eq("SUCCESS")
        );
    }

    @Test
    void updateLeadStatus_InvalidTransition_ThrowsBadRequestException() {
        UpdateLeadStatusRequest request = new UpdateLeadStatusRequest(LeadLifecyclePolicy.STATUS_CLOSED, "Skipping steps");
        when(leadRepository.findById(leadId)).thenReturn(Optional.of(testLead));

        assertThrows(BadRequestException.class, () -> leadService.updateLeadStatus(leadId, request, adminId, "127.0.0.1"));
        verify(leadRepository, never()).save(any());
    }

    @Test
    void getLeadActivityHistory_Success() {
        when(leadRepository.existsById(leadId)).thenReturn(true);
        AdminAuditLog logEntry = new AdminAuditLog(testAdmin, "UPDATE_LEAD_STATUS", "LEAD", leadId.toString(), "NEW", "CONTACTED", "Client called", "127.0.0.1", "SUCCESS");
        logEntry.setId(UUID.randomUUID());
        when(auditLogRepository.findByEntityTypeAndEntityIdOrderByCreatedAtDesc("LEAD", leadId.toString()))
                .thenReturn(List.of(logEntry));

        List<LeadActivityDto> history = leadService.getLeadActivityHistory(leadId);

        assertNotNull(history);
        assertEquals(1, history.size());
        assertEquals("UPDATE_LEAD_STATUS", history.get(0).getAction());
        assertEquals("sales_rep1", history.get(0).getAdminUsername());
    }

    @Test
    void exportLeadsCsv_Success() {
        AdminLeadFilterRequest filter = new AdminLeadFilterRequest();
        when(leadRepository.findAll(any(Specification.class), any(Sort.class))).thenReturn(List.of(testLead));

        byte[] csvBytes = leadService.exportLeadsCsv(filter);

        assertNotNull(csvBytes);
        String csv = new String(csvBytes, StandardCharsets.UTF_8);
        assertTrue(csv.contains("Lead ID,Created At,Status,Seeker Name,Seeker Phone,Property ID,Property Title,Assigned Admin,Assigned At"));
        assertTrue(csv.contains("Alice Smith"));
        assertTrue(csv.contains("Luxury 3 BHK Villa"));
        assertTrue(csv.contains("NEW"));
    }
}
