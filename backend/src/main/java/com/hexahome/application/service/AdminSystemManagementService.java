package com.hexahome.application.service;

import com.hexahome.application.dto.admin.system.*;
import com.hexahome.application.port.in.AdminSystemManagementUseCase;
import com.hexahome.application.port.out.AuditLogPort;
import com.hexahome.domain.exception.BadRequestException;
import com.hexahome.domain.exception.ResourceNotFoundException;
import com.hexahome.persistence.entity.AdminAuditLog;
import com.hexahome.persistence.entity.AdminUser;
import com.hexahome.persistence.repository.AdminAuditLogRepository;
import com.hexahome.persistence.repository.AdminUserRepository;
import com.hexahome.persistence.specification.AdminAuditLogSpecification;
import com.hexahome.persistence.specification.AdminStaffSpecification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;
import java.lang.management.ThreadMXBean;
import java.time.Instant;
import java.util.Set;
import java.util.UUID;

@Service
public class AdminSystemManagementService implements AdminSystemManagementUseCase {

    private static final Logger log = LoggerFactory.getLogger(AdminSystemManagementService.class);
    private static final Set<String> ALLOWED_ADMIN_ROLES = Set.of("SUPER_ADMIN", "MODERATOR", "SUPPORT", "SALES", "CONTENT");
    private static final Set<String> ALLOWED_AUDIT_SORT = Set.of("createdAt", "action", "entityType");

    private final AdminAuditLogRepository auditLogRepository;
    private final AdminUserRepository adminUserRepository;
    private final AuditLogPort auditLogPort;
    private final PasswordEncoder passwordEncoder;

    public AdminSystemManagementService(
            AdminAuditLogRepository auditLogRepository,
            AdminUserRepository adminUserRepository,
            AuditLogPort auditLogPort,
            PasswordEncoder passwordEncoder) {
        this.auditLogRepository = auditLogRepository;
        this.adminUserRepository = adminUserRepository;
        this.auditLogPort = auditLogPort;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdminAuditLogResponseDto> searchAuditLogs(AdminAuditLogFilterRequest filter) {
        String safeSort = ALLOWED_AUDIT_SORT.contains(filter.getSortBy()) ? filter.getSortBy() : "createdAt";
        Sort.Direction direction = "ASC".equalsIgnoreCase(filter.getSortDirection()) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(filter.getPage(), filter.getSize(), Sort.by(direction, safeSort));

        Specification<AdminAuditLog> spec = AdminAuditLogSpecification.build(filter);
        Page<AdminAuditLog> logs = auditLogRepository.findAll(spec, pageable);

        return logs.map(this::mapToAuditResponseDto);
    }

    @Override
    @Transactional(readOnly = true)
    public AdminAuditLogResponseDto getAuditLogDetail(UUID logId) {
        AdminAuditLog logEntry = auditLogRepository.findById(logId)
                .orElseThrow(() -> new ResourceNotFoundException("Audit log not found with ID: " + logId));

        return mapToAuditResponseDto(logEntry);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdminStaffDetailDto> searchAdminUsers(String role, Boolean isActive, String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(100, Math.max(1, size)), Sort.by(Sort.Direction.DESC, "createdAt"));
        Specification<AdminUser> spec = AdminStaffSpecification.build(role, isActive, keyword);
        Page<AdminUser> admins = adminUserRepository.findAll(spec, pageable);

        return admins.map(this::mapToStaffDetailDto);
    }

    @Override
    @Transactional
    public AdminStaffDetailDto createAdminUser(CreateAdminUserRequest request, UUID creatorAdminId, String ipAddress) {
        String normalizedRole = request.getRole().trim().toUpperCase();
        if (!ALLOWED_ADMIN_ROLES.contains(normalizedRole)) {
            throw new BadRequestException("Unsupported admin role: " + request.getRole() + ". Allowed: " + ALLOWED_ADMIN_ROLES);
        }

        if (adminUserRepository.existsByUsername(request.getUsername().trim())) {
            throw new BadRequestException("Username '" + request.getUsername() + "' is already taken");
        }

        if (adminUserRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new BadRequestException("Email '" + request.getEmail() + "' is already registered");
        }

        AdminUser newAdmin = new AdminUser();
        newAdmin.setUsername(request.getUsername().trim());
        newAdmin.setEmail(request.getEmail().trim().toLowerCase());
        newAdmin.setFullName(request.getFullName().trim());
        newAdmin.setRole(normalizedRole);
        newAdmin.setPasswordHash(passwordEncoder.encode(request.getTemporaryPassword()));
        newAdmin.setActive(true);

        AdminUser saved = adminUserRepository.save(newAdmin);

        auditLogPort.recordAction(
                creatorAdminId,
                "CREATE_ADMIN_USER",
                "ADMIN_USER",
                saved.getId().toString(),
                null,
                saved.getUsername() + " (" + saved.getRole() + ")",
                "Provisioned admin account for " + saved.getFullName(),
                ipAddress,
                "SUCCESS"
        );

        log.info("Admin user {} provisioned with role {} by admin {}", saved.getUsername(), saved.getRole(), creatorAdminId);

        return mapToStaffDetailDto(saved);
    }

    @Override
    @Transactional
    public AdminStaffDetailDto updateAdminUser(UUID adminId, UpdateAdminUserRequest request, UUID editorAdminId, String ipAddress) {
        AdminUser admin = adminUserRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found with ID: " + adminId));

        String previousState = String.format("Role=%s, Active=%s", admin.getRole(), admin.isActive());

        if (StringUtils.hasText(request.getFullName())) {
            admin.setFullName(request.getFullName().trim());
        }

        if (StringUtils.hasText(request.getRole())) {
            String normalizedRole = request.getRole().trim().toUpperCase();
            if (!ALLOWED_ADMIN_ROLES.contains(normalizedRole)) {
                throw new BadRequestException("Unsupported admin role: " + request.getRole() + ". Allowed: " + ALLOWED_ADMIN_ROLES);
            }
            admin.setRole(normalizedRole);
        }

        if (request.getIsActive() != null) {
            admin.setActive(request.getIsActive());
        }

        if (StringUtils.hasText(request.getNewPassword())) {
            admin.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
            admin.setFailedLoginAttempts(0);
            admin.setLockedUntil(null);
        }

        AdminUser saved = adminUserRepository.save(admin);
        String newState = String.format("Role=%s, Active=%s", saved.getRole(), saved.isActive());

        auditLogPort.recordAction(
                editorAdminId,
                "UPDATE_ADMIN_USER",
                "ADMIN_USER",
                adminId.toString(),
                previousState,
                newState,
                "Updated admin account parameters",
                ipAddress,
                "SUCCESS"
        );

        log.info("Admin user {} updated by {}", admin.getUsername(), editorAdminId);

        return mapToStaffDetailDto(saved);
    }

    @Override
    public SystemHealthMetricsDto getSystemHealthMetrics() {
        Runtime runtime = Runtime.getRuntime();
        MemoryMXBean memoryBean = ManagementFactory.getMemoryMXBean();
        ThreadMXBean threadBean = ManagementFactory.getThreadMXBean();

        SystemHealthMetricsDto dto = new SystemHealthMetricsDto();
        dto.setHeapMemoryUsedBytes(runtime.totalMemory() - runtime.freeMemory());
        dto.setHeapMemoryMaxBytes(runtime.maxMemory());
        dto.setNonHeapMemoryUsedBytes(memoryBean.getNonHeapMemoryUsage().getUsed());
        dto.setAvailableProcessors(runtime.availableProcessors());
        dto.setUptimeMillis(ManagementFactory.getRuntimeMXBean().getUptime());
        dto.setLiveThreadCount(threadBean.getThreadCount());
        dto.setPeakThreadCount(threadBean.getPeakThreadCount());
        dto.setJavaVersion(System.getProperty("java.version"));
        dto.setOsName(System.getProperty("os.name"));
        dto.setTimestamp(Instant.now());

        return dto;
    }

    private AdminAuditLogResponseDto mapToAuditResponseDto(AdminAuditLog logEntry) {
        AdminAuditLogResponseDto dto = new AdminAuditLogResponseDto();
        dto.setId(logEntry.getId());
        if (logEntry.getAdmin() != null) {
            dto.setAdminId(logEntry.getAdmin().getId());
            dto.setAdminUsername(logEntry.getAdmin().getUsername());
        } else {
            dto.setAdminUsername("SYSTEM");
        }
        dto.setAction(logEntry.getAction());
        dto.setEntityType(logEntry.getEntityType());
        dto.setEntityId(logEntry.getEntityId());
        dto.setPreviousValue(logEntry.getPreviousValue());
        dto.setNewValue(logEntry.getNewValue());
        dto.setReason(logEntry.getReason());
        dto.setIpAddress(logEntry.getIpAddress());
        dto.setOutcome(logEntry.getOutcome());
        dto.setCreatedAt(logEntry.getCreatedAt());
        return dto;
    }

    private AdminStaffDetailDto mapToStaffDetailDto(AdminUser admin) {
        AdminStaffDetailDto dto = new AdminStaffDetailDto();
        dto.setId(admin.getId());
        dto.setUsername(admin.getUsername());
        dto.setEmail(admin.getEmail());
        dto.setFullName(admin.getFullName());
        dto.setRole(admin.getRole());
        dto.setActive(admin.isActive());
        dto.setFailedLoginAttempts(admin.getFailedLoginAttempts());
        dto.setLockedUntil(admin.getLockedUntil());
        dto.setCreatedAt(admin.getCreatedAt());
        dto.setUpdatedAt(admin.getUpdatedAt());
        return dto;
    }
}
