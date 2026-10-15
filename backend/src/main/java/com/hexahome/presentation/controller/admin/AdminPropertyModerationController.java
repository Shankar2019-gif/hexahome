package com.hexahome.presentation.controller.admin;

import com.hexahome.application.dto.admin.moderation.*;
import com.hexahome.application.port.in.AdminListingModerationUseCase;
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
@RequestMapping("/api/admin/properties")
@Tag(name = "Admin Property Moderation", description = "Property listing review, verification, moderation, and bulk actions")
public class AdminPropertyModerationController {

    private final AdminListingModerationUseCase moderationService;

    public AdminPropertyModerationController(AdminListingModerationUseCase moderationService) {
        this.moderationService = moderationService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MODERATOR', 'SUPPORT', 'SALES', 'CONTENT')")
    @Operation(summary = "Search listings with moderation filters & pagination", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Page<AdminPropertySummaryDto>>> searchListings(
            @Valid @ModelAttribute AdminPropertyFilterRequest filter) {

        Page<AdminPropertySummaryDto> results = moderationService.searchListings(filter);
        return ResponseEntity.ok(ApiResponse.success("Listings retrieved successfully", results));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MODERATOR', 'SUPPORT', 'SALES', 'CONTENT')")
    @Operation(summary = "Get full property detail for moderation inspection", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<AdminPropertyDetailDto>> getListingDetail(
            @PathVariable UUID id) {

        AdminPropertyDetailDto detail = moderationService.getListingDetail(id);
        return ResponseEntity.ok(ApiResponse.success("Listing details retrieved successfully", detail));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MODERATOR')")
    @Operation(summary = "Approve and activate property listing", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Void>> approveListing(
            @PathVariable UUID id,
            @AuthenticationPrincipal AdminPrincipal admin,
            HttpServletRequest request) {

        moderationService.approveListing(id, admin.getId(), extractClientIp(request));
        return ResponseEntity.ok(ApiResponse.success("Listing approved successfully", null));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MODERATOR')")
    @Operation(summary = "Reject property listing with mandatory reason", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Void>> rejectListing(
            @PathVariable UUID id,
            @Valid @RequestBody RejectListingRequest body,
            @AuthenticationPrincipal AdminPrincipal admin,
            HttpServletRequest request) {

        moderationService.rejectListing(id, body.getReason(), admin.getId(), extractClientIp(request));
        return ResponseEntity.ok(ApiResponse.success("Listing rejected successfully", null));
    }

    @PostMapping("/{id}/expire")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MODERATOR')")
    @Operation(summary = "Deactivate/expire active property listing", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Void>> expireListing(
            @PathVariable UUID id,
            @AuthenticationPrincipal AdminPrincipal admin,
            HttpServletRequest request) {

        moderationService.expireListing(id, admin.getId(), extractClientIp(request));
        return ResponseEntity.ok(ApiResponse.success("Listing expired successfully", null));
    }

    @PostMapping("/{id}/toggle-hot-deal")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MODERATOR', 'SALES')")
    @Operation(summary = "Toggle property hot deal badge", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Boolean>> toggleHotDeal(
            @PathVariable UUID id,
            @AuthenticationPrincipal AdminPrincipal admin,
            HttpServletRequest request) {

        boolean isHotDeal = moderationService.toggleHotDeal(id, admin.getId(), extractClientIp(request));
        return ResponseEntity.ok(ApiResponse.success("Hot deal status updated to " + isHotDeal, isHotDeal));
    }

    @PostMapping("/bulk-action")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MODERATOR')")
    @Operation(summary = "Execute batch moderation action on multiple listings", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<BulkListingActionResultDto>> executeBulkAction(
            @Valid @RequestBody BulkListingActionRequest body,
            @AuthenticationPrincipal AdminPrincipal admin,
            HttpServletRequest request) {

        BulkListingActionResultDto result = moderationService.executeBulkAction(body, admin.getId(), extractClientIp(request));
        return ResponseEntity.ok(ApiResponse.success("Bulk action completed", result));
    }

    private String extractClientIp(HttpServletRequest request) {
        String xf = request.getHeader("X-Forwarded-For");
        if (xf != null && !xf.isBlank()) {
            return xf.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
