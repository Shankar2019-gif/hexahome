package com.hexahome.presentation.controller.admin;

import com.hexahome.application.dto.admin.system.*;
import com.hexahome.application.port.in.AdminSystemManagementUseCase;
import com.hexahome.infrastructure.security.AdminPrincipal;
import com.hexahome.presentation.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin/system")
@Tag(name = "Admin System & Audit Viewer", description = "Immutable audit log browser, staff provisioning, and runtime diagnostics (SUPER_ADMIN only)")
public class AdminSystemController {

    private final AdminSystemManagementUseCase systemService;

    public AdminSystemController(AdminSystemManagementUseCase systemService) {
        this.systemService = systemService;
    }

    @GetMapping("/audit-logs")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Search immutable audit logs with dynamic filtering and pagination", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Page<AdminAuditLogResponseDto>>> searchAuditLogs(
            @Valid @ModelAttribute AdminAuditLogFilterRequest filter) {

        Page<AdminAuditLogResponseDto> logs = systemService.searchAuditLogs(filter);
        return ResponseEntity.ok(ApiResponse.success("Audit logs retrieved successfully", logs));
    }

    @GetMapping("/audit-logs/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Get single audit log entry detail", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<AdminAuditLogResponseDto>> getAuditLogDetail(
            @PathVariable UUID id) {

        AdminAuditLogResponseDto detail = systemService.getAuditLogDetail(id);
        return ResponseEntity.ok(ApiResponse.success("Audit log detail retrieved successfully", detail));
    }

    @GetMapping("/admins")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Search administrative staff accounts", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Page<AdminStaffDetailDto>>> searchAdminUsers(
            @RequestParam(value = "role", required = false) String role,
            @RequestParam(value = "isActive", required = false) Boolean isActive,
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {

        Page<AdminStaffDetailDto> admins = systemService.searchAdminUsers(role, isActive, keyword, page, size);
        return ResponseEntity.ok(ApiResponse.success("Admin staff retrieved successfully", admins));
    }

    @PostMapping("/admins")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Provision a new admin user account", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<AdminStaffDetailDto>> createAdminUser(
            @Valid @RequestBody CreateAdminUserRequest request,
            @AuthenticationPrincipal AdminPrincipal principal,
            HttpServletRequest servletRequest) {

        AdminStaffDetailDto created = systemService.createAdminUser(
                request, principal.getId(), extractClientIp(servletRequest));
        return ResponseEntity.ok(ApiResponse.success("Admin user created successfully", created));
    }

    @PutMapping("/admins/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Update admin user account role, status, or credentials", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<AdminStaffDetailDto>> updateAdminUser(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateAdminUserRequest request,
            @AuthenticationPrincipal AdminPrincipal principal,
            HttpServletRequest servletRequest) {

        AdminStaffDetailDto updated = systemService.updateAdminUser(
                id, request, principal.getId(), extractClientIp(servletRequest));
        return ResponseEntity.ok(ApiResponse.success("Admin user updated successfully", updated));
    }

    @GetMapping("/health")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Retrieve real-time JVM runtime memory and diagnostics", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<SystemHealthMetricsDto>> getSystemHealthMetrics() {
        SystemHealthMetricsDto metrics = systemService.getSystemHealthMetrics();
        return ResponseEntity.ok(ApiResponse.success("System health metrics retrieved successfully", metrics));
    }

    private String extractClientIp(HttpServletRequest request) {
        String xf = request.getHeader("X-Forwarded-For");
        if (xf != null && !xf.isBlank()) {
            return xf.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
