package com.hexahome.application.service;

import com.hexahome.application.dto.admin.user.*;
import com.hexahome.application.port.in.AdminUserManagementUseCase;
import com.hexahome.application.port.out.AuditLogPort;
import com.hexahome.domain.exception.BadRequestException;
import com.hexahome.domain.exception.ResourceNotFoundException;
import com.hexahome.persistence.entity.Role;
import com.hexahome.persistence.entity.User;
import com.hexahome.persistence.repository.LeadRepository;
import com.hexahome.persistence.repository.PropertyRepository;
import com.hexahome.persistence.repository.UserRepository;
import com.hexahome.persistence.specification.AdminUserSpecification;
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

import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AdminUserManagementService implements AdminUserManagementUseCase {

    private static final Logger log = LoggerFactory.getLogger(AdminUserManagementService.class);
    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("createdAt", "name", "phone", "email", "updatedAt");

    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final LeadRepository leadRepository;
    private final AuditLogPort auditLogPort;

    public AdminUserManagementService(
            UserRepository userRepository,
            PropertyRepository propertyRepository,
            LeadRepository leadRepository,
            AuditLogPort auditLogPort) {
        this.userRepository = userRepository;
        this.propertyRepository = propertyRepository;
        this.leadRepository = leadRepository;
        this.auditLogPort = auditLogPort;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdminUserProfileSummaryDto> searchUsers(AdminUserFilterRequest request) {
        String safeSort = ALLOWED_SORT_FIELDS.contains(request.getSortBy()) ? request.getSortBy() : "createdAt";
        Sort.Direction direction = "ASC".equalsIgnoreCase(request.getSortDirection()) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(request.getPage(), request.getSize(), Sort.by(direction, safeSort));

        Specification<User> spec = AdminUserSpecification.build(request);
        Page<User> userPage = userRepository.findAll(spec, pageable);

        return userPage.map(this::mapToSummaryDto);
    }

    @Override
    @Transactional(readOnly = true)
    public AdminUserProfileDetailDto getUserDetail(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        AdminUserProfileDetailDto dto = new AdminUserProfileDetailDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setMaskedPhone(maskPhone(user.getPhone()));
        dto.setMaskedEmail(maskEmail(user.getEmail()));
        dto.setProfilePicUrl(user.getProfilePicUrl());
        dto.setRoles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()));
        dto.setActive(user.isActive());
        dto.setVerified(user.isVerified());
        dto.setTotalPropertiesListed(propertyRepository.countByOwnerId(user.getId()));
        dto.setTotalLeadsSubmitted(leadRepository.countBySeekerId(user.getId()));
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());

        return dto;
    }

    @Override
    @Transactional
    public void blockUser(UUID userId, UserBlockActionRequest request, UUID adminId, String ipAddress) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        if (!user.isActive()) {
            throw new BadRequestException("User is already inactive/blocked");
        }

        user.setActive(false);
        userRepository.save(user);

        auditLogPort.recordAction(
                adminId,
                "BLOCK_USER",
                "USER",
                userId.toString(),
                "ACTIVE",
                "BLOCKED",
                request.getReason(),
                ipAddress,
                "SUCCESS"
        );

        log.info("Admin {} blocked customer user {} with reason: {}", adminId, userId, request.getReason());
    }

    @Override
    @Transactional
    public void unblockUser(UUID userId, UserBlockActionRequest request, UUID adminId, String ipAddress) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        if (user.isActive()) {
            throw new BadRequestException("User is already active");
        }

        user.setActive(true);
        userRepository.save(user);

        auditLogPort.recordAction(
                adminId,
                "UNBLOCK_USER",
                "USER",
                userId.toString(),
                "BLOCKED",
                "ACTIVE",
                request.getReason(),
                ipAddress,
                "SUCCESS"
        );

        log.info("Admin {} unblocked customer user {} with reason: {}", adminId, userId, request.getReason());
    }

    @Override
    @Transactional
    public RevealPiiResponse revealUserPii(UUID userId, RevealPiiRequest request, UUID adminId, String ipAddress) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        auditLogPort.recordAction(
                adminId,
                "REVEAL_USER_PII",
                "USER",
                userId.toString(),
                null,
                "PII_REVEALED",
                request.getReason(),
                ipAddress,
                "SUCCESS"
        );

        log.warn("AUDIT ALERT: Admin {} revealed sensitive PII for user {} with reason: {}", adminId, userId, request.getReason());

        return new RevealPiiResponse(user.getId(), user.getPhone(), user.getEmail());
    }

    private AdminUserProfileSummaryDto mapToSummaryDto(User user) {
        AdminUserProfileSummaryDto dto = new AdminUserProfileSummaryDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setMaskedPhone(maskPhone(user.getPhone()));
        dto.setMaskedEmail(maskEmail(user.getEmail()));
        dto.setRoles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()));
        dto.setActive(user.isActive());
        dto.setVerified(user.isVerified());
        dto.setPropertyCount(propertyRepository.countByOwnerId(user.getId()));
        dto.setCreatedAt(user.getCreatedAt());
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

    private String maskEmail(String email) {
        if (!StringUtils.hasText(email)) {
            return "***";
        }
        String trimmed = email.trim();
        int atIndex = trimmed.indexOf('@');
        if (atIndex <= 1) {
            return "***" + (atIndex >= 0 ? trimmed.substring(atIndex) : "");
        }
        String local = trimmed.substring(0, atIndex);
        String domain = trimmed.substring(atIndex);
        return local.charAt(0) + "*".repeat(Math.max(1, local.length() - 1)) + domain;
    }
}
