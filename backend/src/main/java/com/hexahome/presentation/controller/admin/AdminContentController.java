package com.hexahome.presentation.controller.admin;

import com.hexahome.application.dto.admin.content.*;
import com.hexahome.application.port.in.AdminContentManagementUseCase;
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

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/content")
@Tag(name = "Admin Content & Media Management", description = "S3 presigned uploads, Cities, Localities, FAQs, and Listing Abuse Reports")
public class AdminContentController {

    private final AdminContentManagementUseCase contentService;

    public AdminContentController(AdminContentManagementUseCase contentService) {
        this.contentService = contentService;
    }

    @PostMapping("/media/presigned-upload")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MODERATOR', 'CONTENT')")
    @Operation(summary = "Generate S3 presigned PUT URL for media uploads", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<AdminPresignedUploadResponse>> generatePresignedUploadUrl(
            @Valid @RequestBody AdminPresignedUploadRequest request,
            @AuthenticationPrincipal AdminPrincipal admin,
            HttpServletRequest servletRequest) {

        AdminPresignedUploadResponse response = contentService.generatePresignedUploadUrl(
                request, admin.getId(), extractClientIp(servletRequest));
        return ResponseEntity.ok(ApiResponse.success("Presigned upload URL generated successfully", response));
    }

    @GetMapping("/cities")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MODERATOR', 'CONTENT')")
    @Operation(summary = "Get all cities with display order and active status", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<List<AdminCityDto>>> getAllCities() {
        List<AdminCityDto> cities = contentService.getAllCities();
        return ResponseEntity.ok(ApiResponse.success("Cities retrieved successfully", cities));
    }

    @PostMapping("/cities")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'CONTENT')")
    @Operation(summary = "Create platform city", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<AdminCityDto>> createCity(
            @Valid @RequestBody CreateCityRequest request,
            @AuthenticationPrincipal AdminPrincipal admin,
            HttpServletRequest servletRequest) {

        AdminCityDto city = contentService.createCity(request, admin.getId(), extractClientIp(servletRequest));
        return ResponseEntity.ok(ApiResponse.success("City created successfully", city));
    }

    @PutMapping("/cities/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'CONTENT')")
    @Operation(summary = "Update city metadata and status", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<AdminCityDto>> updateCity(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateCityRequest request,
            @AuthenticationPrincipal AdminPrincipal admin,
            HttpServletRequest servletRequest) {

        AdminCityDto city = contentService.updateCity(id, request, admin.getId(), extractClientIp(servletRequest));
        return ResponseEntity.ok(ApiResponse.success("City updated successfully", city));
    }

    @GetMapping("/localities")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MODERATOR', 'CONTENT')")
    @Operation(summary = "Get localities by city ID", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<List<AdminLocalityDto>>> getLocalitiesByCity(
            @RequestParam("cityId") Integer cityId) {

        List<AdminLocalityDto> localities = contentService.getLocalitiesByCity(cityId);
        return ResponseEntity.ok(ApiResponse.success("Localities retrieved successfully", localities));
    }

    @PostMapping("/localities")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'CONTENT')")
    @Operation(summary = "Create locality under city", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<AdminLocalityDto>> createLocality(
            @Valid @RequestBody CreateLocalityRequest request,
            @AuthenticationPrincipal AdminPrincipal admin,
            HttpServletRequest servletRequest) {

        AdminLocalityDto locality = contentService.createLocality(request, admin.getId(), extractClientIp(servletRequest));
        return ResponseEntity.ok(ApiResponse.success("Locality created successfully", locality));
    }

    @PutMapping("/localities/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'CONTENT')")
    @Operation(summary = "Update locality metadata", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<AdminLocalityDto>> updateLocality(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateLocalityRequest request,
            @AuthenticationPrincipal AdminPrincipal admin,
            HttpServletRequest servletRequest) {

        AdminLocalityDto locality = contentService.updateLocality(id, request, admin.getId(), extractClientIp(servletRequest));
        return ResponseEntity.ok(ApiResponse.success("Locality updated successfully", locality));
    }

    @GetMapping("/faqs")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MODERATOR', 'CONTENT')")
    @Operation(summary = "Get all platform FAQs ordered by display order", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<List<AdminFaqDto>>> getAllFaqs() {
        List<AdminFaqDto> faqs = contentService.getAllFaqs();
        return ResponseEntity.ok(ApiResponse.success("FAQs retrieved successfully", faqs));
    }

    @PostMapping("/faqs")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'CONTENT')")
    @Operation(summary = "Create platform FAQ", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<AdminFaqDto>> createFaq(
            @Valid @RequestBody CreateFaqRequest request,
            @AuthenticationPrincipal AdminPrincipal admin,
            HttpServletRequest servletRequest) {

        AdminFaqDto faq = contentService.createFaq(request, admin.getId(), extractClientIp(servletRequest));
        return ResponseEntity.ok(ApiResponse.success("FAQ created successfully", faq));
    }

    @PutMapping("/faqs/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'CONTENT')")
    @Operation(summary = "Update platform FAQ", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<AdminFaqDto>> updateFaq(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateFaqRequest request,
            @AuthenticationPrincipal AdminPrincipal admin,
            HttpServletRequest servletRequest) {

        AdminFaqDto faq = contentService.updateFaq(id, request, admin.getId(), extractClientIp(servletRequest));
        return ResponseEntity.ok(ApiResponse.success("FAQ updated successfully", faq));
    }

    @DeleteMapping("/faqs/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'CONTENT')")
    @Operation(summary = "Delete platform FAQ", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Void>> deleteFaq(
            @PathVariable Integer id,
            @AuthenticationPrincipal AdminPrincipal admin,
            HttpServletRequest servletRequest) {

        contentService.deleteFaq(id, admin.getId(), extractClientIp(servletRequest));
        return ResponseEntity.ok(ApiResponse.success("FAQ deleted successfully", null));
    }

    @GetMapping("/reports")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MODERATOR')")
    @Operation(summary = "Search listing abuse and spam reports", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Page<AdminReportSummaryDto>>> searchReports(
            @Valid @ModelAttribute AdminReportFilterRequest filter) {

        Page<AdminReportSummaryDto> reports = contentService.searchReports(filter);
        return ResponseEntity.ok(ApiResponse.success("Abuse reports retrieved successfully", reports));
    }

    @PatchMapping("/reports/{id}/status")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MODERATOR')")
    @Operation(summary = "Update abuse report moderation status (REVIEWED, RESOLVED, DISMISSED)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Void>> updateReportStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateReportStatusRequest request,
            @AuthenticationPrincipal AdminPrincipal admin,
            HttpServletRequest servletRequest) {

        contentService.updateReportStatus(id, request, admin.getId(), extractClientIp(servletRequest));
        return ResponseEntity.ok(ApiResponse.success("Report status updated successfully", null));
    }

    private String extractClientIp(HttpServletRequest request) {
        String xf = request.getHeader("X-Forwarded-For");
        if (xf != null && !xf.isBlank()) {
            return xf.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
