package com.hexahome.presentation.controller;

import com.hexahome.presentation.response.ApiResponse;
import com.hexahome.application.dto.billing.PlanDto;
import com.hexahome.application.dto.billing.UserSubscriptionDto;
import com.hexahome.infrastructure.security.UserPrincipal;
import com.hexahome.application.service.SubscriptionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Tag(name = "Monetization & Plans", description = "Endpoints for exploring subscription plans and checking active quota credits")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    public SubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    @GetMapping("/api/v1/plans")
    @Operation(summary = "List all subscription plans", description = "Returns active pricing plans for tenants, buyers, or owners")
    public ResponseEntity<ApiResponse<List<PlanDto>>> getAllPlans(
            @RequestParam(required = false) String role) {
        List<PlanDto> plans = role != null
                ? subscriptionService.getPlansByTargetRole(role)
                : subscriptionService.getAllActivePlans();
        return ResponseEntity.ok(ApiResponse.success("Plans retrieved successfully", plans));
    }

    @GetMapping("/api/v1/plans/{id}")
    @Operation(summary = "Get plan details by ID", description = "Returns features, credit count, and price for a specific plan")
    public ResponseEntity<ApiResponse<PlanDto>> getPlanById(@PathVariable String id) {
        PlanDto plan = subscriptionService.getPlanById(id);
        return ResponseEntity.ok(ApiResponse.success("Plan retrieved successfully", plan));
    }

    @GetMapping("/api/v1/subscriptions/current")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get current user subscription", description = "Returns authenticated user's active plan, remaining contact credits, and expiry timestamp")
    public ResponseEntity<ApiResponse<UserSubscriptionDto>> getCurrentSubscription(
            @AuthenticationPrincipal UserPrincipal principal) {
        UserSubscriptionDto sub = subscriptionService.getCurrentUserSubscription(principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Subscription retrieved successfully", sub));
    }
}
