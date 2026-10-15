package com.hexahome.presentation.controller.admin;

import com.hexahome.application.dto.admin.dashboard.AdminDashboardStatsDto;
import com.hexahome.application.port.in.AdminDashboardUseCase;
import com.hexahome.presentation.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
@Tag(name = "Admin Dashboard", description = "Operational metrics, platform vitals, and activity stream")
public class AdminDashboardController {

    private final AdminDashboardUseCase dashboardService;

    public AdminDashboardController(AdminDashboardUseCase dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/metrics")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MODERATOR', 'SUPPORT', 'SALES', 'CONTENT')")
    @Operation(summary = "Get aggregated operational dashboard metrics", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<AdminDashboardStatsDto>> getMetrics() {
        AdminDashboardStatsDto metrics = dashboardService.getDashboardMetrics();
        return ResponseEntity.ok(ApiResponse.success("Dashboard metrics retrieved successfully", metrics));
    }
}
