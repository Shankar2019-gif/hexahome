package com.hexahome.presentation.controller.admin;

import com.hexahome.application.dto.admin.lead.*;
import com.hexahome.application.port.in.AdminLeadManagementUseCase;
import com.hexahome.infrastructure.security.AdminPrincipal;
import com.hexahome.presentation.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/leads")
@Tag(name = "Admin Lead Management", description = "Lead management, sales pipeline, assignment, and status moderation")
public class AdminLeadController {

    private final AdminLeadManagementUseCase leadService;

    public AdminLeadController(AdminLeadManagementUseCase leadService) {
        this.leadService = leadService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MODERATOR', 'SUPPORT', 'SALES')")
    @Operation(summary = "Search leads with filtering and pagination", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Page<AdminLeadSummaryDto>>> searchLeads(
            @Valid @ModelAttribute AdminLeadFilterRequest filter) {

        Page<AdminLeadSummaryDto> results = leadService.searchLeads(filter);
        return ResponseEntity.ok(ApiResponse.success("Leads retrieved successfully", results));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MODERATOR', 'SUPPORT', 'SALES')")
    @Operation(summary = "Get complete lead details", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<AdminLeadDetailDto>> getLeadDetail(
            @PathVariable UUID id) {

        AdminLeadDetailDto detail = leadService.getLeadDetail(id);
        return ResponseEntity.ok(ApiResponse.success("Lead detail retrieved successfully", detail));
    }

    @PostMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SALES')")
    @Operation(summary = "Assign lead to an admin user (Sales/Support)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Void>> assignLead(
            @PathVariable UUID id,
            @Valid @RequestBody AssignLeadRequest request,
            @AuthenticationPrincipal AdminPrincipal admin,
            HttpServletRequest servletRequest) {

        leadService.assignLead(id, request, admin.getId(), extractClientIp(servletRequest));
        return ResponseEntity.ok(ApiResponse.success("Lead assigned successfully", null));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SALES', 'SUPPORT')")
    @Operation(summary = "Transition lead lifecycle status", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Void>> updateLeadStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateLeadStatusRequest request,
            @AuthenticationPrincipal AdminPrincipal admin,
            HttpServletRequest servletRequest) {

        leadService.updateLeadStatus(id, request, admin.getId(), extractClientIp(servletRequest));
        return ResponseEntity.ok(ApiResponse.success("Lead status updated successfully", null));
    }

    @GetMapping("/{id}/activity")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MODERATOR', 'SUPPORT', 'SALES')")
    @Operation(summary = "Get audit activity history for lead", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<List<LeadActivityDto>>> getLeadActivityHistory(
            @PathVariable UUID id) {

        List<LeadActivityDto> history = leadService.getLeadActivityHistory(id);
        return ResponseEntity.ok(ApiResponse.success("Lead activity history retrieved successfully", history));
    }

    @GetMapping("/export")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SALES')")
    @Operation(summary = "Export filtered leads as CSV stream", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<byte[]> exportLeadsCsv(
            @Valid @ModelAttribute AdminLeadFilterRequest filter) {

        byte[] csvData = leadService.exportLeadsCsv(filter);
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String filename = "leads_export_" + timestamp + ".csv";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvData);
    }

    private String extractClientIp(HttpServletRequest request) {
        String xf = request.getHeader("X-Forwarded-For");
        if (xf != null && !xf.isBlank()) {
            return xf.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
