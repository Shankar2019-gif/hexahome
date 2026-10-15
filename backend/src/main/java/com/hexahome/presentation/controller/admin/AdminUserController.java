package com.hexahome.presentation.controller.admin;

import com.hexahome.application.dto.admin.user.*;
import com.hexahome.application.port.in.AdminUserManagementUseCase;
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
@RequestMapping("/api/admin/users")
@Tag(name = "Admin User Management", description = "Customer account administration, profile inspection, status toggling, and audited PII access")
public class AdminUserController {

    private final AdminUserManagementUseCase userManagementService;

    public AdminUserController(AdminUserManagementUseCase userManagementService) {
        this.userManagementService = userManagementService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MODERATOR', 'SUPPORT')")
    @Operation(summary = "Search users with filters and pagination", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Page<AdminUserProfileSummaryDto>>> searchUsers(
            @Valid @ModelAttribute AdminUserFilterRequest filter) {

        Page<AdminUserProfileSummaryDto> result = userManagementService.searchUsers(filter);
        return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", result));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MODERATOR', 'SUPPORT')")
    @Operation(summary = "Get detailed user profile and metrics", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<AdminUserProfileDetailDto>> getUserDetail(
            @PathVariable UUID id) {

        AdminUserProfileDetailDto detail = userManagementService.getUserDetail(id);
        return ResponseEntity.ok(ApiResponse.success("User detail retrieved successfully", detail));
    }

    @PostMapping("/{id}/block")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MODERATOR')")
    @Operation(summary = "Block user account with audit reason", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Void>> blockUser(
            @PathVariable UUID id,
            @Valid @RequestBody UserBlockActionRequest request,
            @AuthenticationPrincipal AdminPrincipal admin,
            HttpServletRequest servletRequest) {

        userManagementService.blockUser(id, request, admin.getId(), extractClientIp(servletRequest));
        return ResponseEntity.ok(ApiResponse.success("User blocked successfully", null));
    }

    @PostMapping("/{id}/unblock")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MODERATOR')")
    @Operation(summary = "Unblock user account with audit reason", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Void>> unblockUser(
            @PathVariable UUID id,
            @Valid @RequestBody UserBlockActionRequest request,
            @AuthenticationPrincipal AdminPrincipal admin,
            HttpServletRequest servletRequest) {

        userManagementService.unblockUser(id, request, admin.getId(), extractClientIp(servletRequest));
        return ResponseEntity.ok(ApiResponse.success("User unblocked successfully", null));
    }

    @PostMapping("/{id}/reveal-pii")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Reveal user sensitive PII with audited reason (SUPER_ADMIN only)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<RevealPiiResponse>> revealUserPii(
            @PathVariable UUID id,
            @Valid @RequestBody RevealPiiRequest request,
            @AuthenticationPrincipal AdminPrincipal admin,
            HttpServletRequest servletRequest) {

        RevealPiiResponse response = userManagementService.revealUserPii(id, request, admin.getId(), extractClientIp(servletRequest));
        return ResponseEntity.ok(ApiResponse.success("User PII revealed and audit logged", response));
    }

    private String extractClientIp(HttpServletRequest request) {
        String xf = request.getHeader("X-Forwarded-For");
        if (xf != null && !xf.isBlank()) {
            return xf.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
