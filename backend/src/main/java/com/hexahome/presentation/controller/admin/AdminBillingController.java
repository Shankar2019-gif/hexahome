package com.hexahome.presentation.controller.admin;

import com.hexahome.application.dto.admin.billing.*;
import com.hexahome.application.port.in.AdminBillingManagementUseCase;
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
@RequestMapping("/api/admin/billing")
@Tag(name = "Admin Billing & Plans Management", description = "Subscription lifecycle, validity extensions, credit grants, and payment transaction logs")
public class AdminBillingController {

    private final AdminBillingManagementUseCase billingService;

    public AdminBillingController(AdminBillingManagementUseCase billingService) {
        this.billingService = billingService;
    }

    @GetMapping("/subscriptions")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SALES', 'SUPPORT')")
    @Operation(summary = "Search customer subscriptions with filters and pagination", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Page<AdminSubscriptionSummaryDto>>> searchSubscriptions(
            @Valid @ModelAttribute AdminSubscriptionFilterRequest filter) {

        Page<AdminSubscriptionSummaryDto> results = billingService.searchSubscriptions(filter);
        return ResponseEntity.ok(ApiResponse.success("Subscriptions retrieved successfully", results));
    }

    @GetMapping("/subscriptions/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SALES', 'SUPPORT')")
    @Operation(summary = "Get full subscription details and credit breakdown", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<AdminSubscriptionDetailDto>> getSubscriptionDetail(
            @PathVariable UUID id) {

        AdminSubscriptionDetailDto detail = billingService.getSubscriptionDetail(id);
        return ResponseEntity.ok(ApiResponse.success("Subscription detail retrieved successfully", detail));
    }

    @PostMapping("/subscriptions/{id}/extend")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SALES')")
    @Operation(summary = "Extend subscription validity duration with audit trail", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Void>> extendSubscription(
            @PathVariable UUID id,
            @Valid @RequestBody ExtendSubscriptionRequest request,
            @AuthenticationPrincipal AdminPrincipal admin,
            HttpServletRequest servletRequest) {

        billingService.extendSubscription(id, request, admin.getId(), extractClientIp(servletRequest));
        return ResponseEntity.ok(ApiResponse.success("Subscription extended successfully", null));
    }

    @PostMapping("/subscriptions/{id}/cancel")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SALES')")
    @Operation(summary = "Cancel subscription immediately with audit trail", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Void>> cancelSubscription(
            @PathVariable UUID id,
            @Valid @RequestBody CancelSubscriptionRequest request,
            @AuthenticationPrincipal AdminPrincipal admin,
            HttpServletRequest servletRequest) {

        billingService.cancelSubscription(id, request, admin.getId(), extractClientIp(servletRequest));
        return ResponseEntity.ok(ApiResponse.success("Subscription cancelled successfully", null));
    }

    @PostMapping("/subscriptions/{id}/grant-credits")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SALES')")
    @Operation(summary = "Manually grant contact credits with audit trail", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Void>> manualGrantCredits(
            @PathVariable UUID id,
            @Valid @RequestBody ManualGrantCreditsRequest request,
            @AuthenticationPrincipal AdminPrincipal admin,
            HttpServletRequest servletRequest) {

        billingService.manualGrantCredits(id, request, admin.getId(), extractClientIp(servletRequest));
        return ResponseEntity.ok(ApiResponse.success("Credits granted successfully", null));
    }

    @GetMapping("/payments")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SALES', 'SUPPORT')")
    @Operation(summary = "Search payment transactions with filters and pagination", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Page<AdminPaymentSummaryDto>>> searchPayments(
            @Valid @ModelAttribute AdminPaymentFilterRequest filter) {

        Page<AdminPaymentSummaryDto> results = billingService.searchPayments(filter);
        return ResponseEntity.ok(ApiResponse.success("Payments retrieved successfully", results));
    }

    private String extractClientIp(HttpServletRequest request) {
        String xf = request.getHeader("X-Forwarded-For");
        if (xf != null && !xf.isBlank()) {
            return xf.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
