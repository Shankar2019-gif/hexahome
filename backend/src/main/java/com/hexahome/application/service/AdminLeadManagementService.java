package com.hexahome.application.service;

import com.hexahome.application.dto.admin.lead.*;
import com.hexahome.application.port.in.AdminLeadManagementUseCase;
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
import com.hexahome.persistence.specification.AdminLeadSpecification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AdminLeadManagementService implements AdminLeadManagementUseCase {

    private static final Logger log = LoggerFactory.getLogger(AdminLeadManagementService.class);
    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("createdAt", "updatedAt", "status", "seekerName", "assignedAt");

    private final LeadRepository leadRepository;
    private final AdminUserRepository adminUserRepository;
    private final AdminAuditLogRepository auditLogRepository;
    private final AuditLogPort auditLogPort;

    public AdminLeadManagementService(
            LeadRepository leadRepository,
            AdminUserRepository adminUserRepository,
            AdminAuditLogRepository auditLogRepository,
            AuditLogPort auditLogPort) {
        this.leadRepository = leadRepository;
        this.adminUserRepository = adminUserRepository;
        this.auditLogRepository = auditLogRepository;
        this.auditLogPort = auditLogPort;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdminLeadSummaryDto> searchLeads(AdminLeadFilterRequest request) {
        String safeSort = ALLOWED_SORT_FIELDS.contains(request.getSortBy()) ? request.getSortBy() : "createdAt";
        Sort.Direction direction = "ASC".equalsIgnoreCase(request.getSortDirection()) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(request.getPage(), request.getSize(), Sort.by(direction, safeSort));

        Specification<Lead> spec = AdminLeadSpecification.build(request);
        Page<Lead> leadsPage = leadRepository.findAll(spec, pageable);

        return leadsPage.map(this::mapToSummaryDto);
    }

    @Override
    @Transactional(readOnly = true)
    public AdminLeadDetailDto getLeadDetail(UUID leadId) {
        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with ID: " + leadId));

        AdminLeadDetailDto dto = new AdminLeadDetailDto();
        dto.setId(lead.getId());

        Property property = lead.getProperty();
        if (property != null) {
            dto.setPropertyId(property.getId());
            dto.setPropertyTitle(property.getTitle());
            dto.setPropertyShortId(property.getShortId());
            dto.setPropertyAdType(property.getAdType());
            dto.setPropertyType(property.getPropertyType());
            if (property.getCity() != null) {
                dto.setPropertyCity(property.getCity().getName());
            }
            if (property.getOwner() != null) {
                dto.setPropertyOwnerId(property.getOwner().getId());
                dto.setPropertyOwnerName(property.getOwner().getName());
            }
        }

        if (lead.getSeeker() != null) {
            dto.setSeekerUserId(lead.getSeeker().getId());
        }
        dto.setSeekerName(lead.getSeekerName());
        dto.setMaskedPhone(maskPhone(lead.getSeekerPhone()));
        dto.setMessage(lead.getMessage());
        dto.setStatus(lead.getStatus());

        AdminUser assignedAdmin = lead.getAssignedAdmin();
        if (assignedAdmin != null) {
            dto.setAssignedAdminId(assignedAdmin.getId());
            dto.setAssignedAdminName(assignedAdmin.getFullName());
            dto.setAssignedAdminEmail(assignedAdmin.getEmail());
            dto.setAssignedAt(lead.getAssignedAt());
        }

        dto.setCreatedAt(lead.getCreatedAt());
        dto.setUpdatedAt(lead.getUpdatedAt());

        return dto;
    }

    @Override
    @Transactional
    public void assignLead(UUID leadId, AssignLeadRequest request, UUID adminId, String ipAddress) {
        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with ID: " + leadId));

        AdminUser targetAdmin = adminUserRepository.findById(request.getAdminId())
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found with ID: " + request.getAdminId()));

        if (!targetAdmin.isActive()) {
            throw new BadRequestException("Target admin account is disabled");
        }

        if (!LeadLifecyclePolicy.isAssignableRole(targetAdmin.getRole())) {
            throw new BadRequestException("Admin with role '" + targetAdmin.getRole() + "' cannot be assigned customer leads");
        }

        String previousAssignedUsername = lead.getAssignedAdmin() != null ? lead.getAssignedAdmin().getUsername() : "UNASSIGNED";

        lead.setAssignedAdmin(targetAdmin);
        lead.setAssignedAt(Instant.now());
        leadRepository.save(lead);

        auditLogPort.recordAction(
                adminId,
                "ASSIGN_LEAD",
                "LEAD",
                leadId.toString(),
                previousAssignedUsername,
                targetAdmin.getUsername(),
                StringUtils.hasText(request.getNotes()) ? request.getNotes() : "Lead assigned to " + targetAdmin.getUsername(),
                ipAddress,
                "SUCCESS"
        );

        log.info("Lead {} assigned to admin {} by {}", leadId, targetAdmin.getUsername(), adminId);
    }

    @Override
    @Transactional
    public void updateLeadStatus(UUID leadId, UpdateLeadStatusRequest request, UUID adminId, String ipAddress) {
        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with ID: " + leadId));

        String previousStatus = lead.getStatus();
        String targetStatus = request.getStatus().trim().toUpperCase();

        LeadLifecyclePolicy.validateTransition(previousStatus, targetStatus);

        lead.setStatus(targetStatus);
        leadRepository.save(lead);

        auditLogPort.recordAction(
                adminId,
                "UPDATE_LEAD_STATUS",
                "LEAD",
                leadId.toString(),
                previousStatus,
                targetStatus,
                StringUtils.hasText(request.getReason()) ? request.getReason() : "Lead status updated to " + targetStatus,
                ipAddress,
                "SUCCESS"
        );

        log.info("Lead {} transitioned status from {} to {} by admin {}", leadId, previousStatus, targetStatus, adminId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeadActivityDto> getLeadActivityHistory(UUID leadId) {
        if (!leadRepository.existsById(leadId)) {
            throw new ResourceNotFoundException("Lead not found with ID: " + leadId);
        }

        List<AdminAuditLog> logs = auditLogRepository.findByEntityTypeAndEntityIdOrderByCreatedAtDesc("LEAD", leadId.toString());

        return logs.stream().map(logEntry -> {
            LeadActivityDto dto = new LeadActivityDto();
            dto.setId(logEntry.getId());
            if (logEntry.getAdmin() != null) {
                dto.setAdminId(logEntry.getAdmin().getId());
                dto.setAdminUsername(logEntry.getAdmin().getUsername());
            } else {
                dto.setAdminUsername("SYSTEM");
            }
            dto.setAction(logEntry.getAction());
            dto.setPreviousValue(logEntry.getPreviousValue());
            dto.setNewValue(logEntry.getNewValue());
            dto.setReason(logEntry.getReason());
            dto.setOutcome(logEntry.getOutcome());
            dto.setTimestamp(logEntry.getCreatedAt());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] exportLeadsCsv(AdminLeadFilterRequest filter) {
        Specification<Lead> spec = AdminLeadSpecification.build(filter);
        List<Lead> leads = leadRepository.findAll(spec, Sort.by(Sort.Direction.DESC, "createdAt"));

        StringBuilder csv = new StringBuilder();
        csv.append("Lead ID,Created At,Status,Seeker Name,Seeker Phone,Property ID,Property Title,Assigned Admin,Assigned At\n");

        for (Lead lead : leads) {
            String leadId = lead.getId() != null ? lead.getId().toString() : "";
            String createdAt = lead.getCreatedAt() != null ? lead.getCreatedAt().toString() : "";
            String status = lead.getStatus() != null ? lead.getStatus() : "";
            String seekerName = escapeCsv(lead.getSeekerName());
            String seekerPhone = escapeCsv(maskPhone(lead.getSeekerPhone()));
            String propertyId = lead.getProperty() != null && lead.getProperty().getId() != null ? lead.getProperty().getId().toString() : "";
            String propertyTitle = lead.getProperty() != null ? escapeCsv(lead.getProperty().getTitle()) : "";
            String assignedAdmin = lead.getAssignedAdmin() != null ? escapeCsv(lead.getAssignedAdmin().getUsername()) : "UNASSIGNED";
            String assignedAt = lead.getAssignedAt() != null ? lead.getAssignedAt().toString() : "";

            csv.append(String.join(",",
                    leadId,
                    createdAt,
                    status,
                    seekerName,
                    seekerPhone,
                    propertyId,
                    propertyTitle,
                    assignedAdmin,
                    assignedAt
            )).append("\n");
        }

        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }

    private AdminLeadSummaryDto mapToSummaryDto(Lead lead) {
        AdminLeadSummaryDto dto = new AdminLeadSummaryDto();
        dto.setId(lead.getId());
        if (lead.getProperty() != null) {
            dto.setPropertyId(lead.getProperty().getId());
            dto.setPropertyTitle(lead.getProperty().getTitle());
            dto.setPropertyShortId(lead.getProperty().getShortId());
        }
        dto.setSeekerName(lead.getSeekerName());
        dto.setMaskedPhone(maskPhone(lead.getSeekerPhone()));
        dto.setStatus(lead.getStatus());
        if (lead.getAssignedAdmin() != null) {
            dto.setAssignedAdminId(lead.getAssignedAdmin().getId());
            dto.setAssignedAdminName(lead.getAssignedAdmin().getFullName());
        }
        dto.setAssignedAt(lead.getAssignedAt());
        dto.setCreatedAt(lead.getCreatedAt());
        dto.setUpdatedAt(lead.getUpdatedAt());
        return dto;
    }

    private String maskPhone(String phone) {
        if (!StringUtils.hasText(phone)) {
            return "***";
        }
        String trimmed = phone.trim();
        if (trimmed.length() <= 4) {
            return "****";
        }
        String lastFour = trimmed.substring(trimmed.length() - 4);
        return "*".repeat(trimmed.length() - 4) + lastFour;
    }

    private String escapeCsv(String value) {
        if (value == null) {
            return "";
        }
        String str = value.trim();
        if (str.contains(",") || str.contains("\"") || str.contains("\n") || str.contains("\r")) {
            return "\"" + str.replace("\"", "\"\"") + "\"";
        }
        return str;
    }
}
