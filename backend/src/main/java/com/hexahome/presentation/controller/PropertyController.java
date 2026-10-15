package com.hexahome.presentation.controller;

import com.hexahome.presentation.response.ApiResponse;
import com.hexahome.application.dto.property.CreatePropertyRequest;
import com.hexahome.application.dto.property.PropertyDetailDto;
import com.hexahome.application.dto.property.PropertyFilterRequest;
import com.hexahome.application.dto.property.PropertySummaryDto;
import com.hexahome.infrastructure.security.UserPrincipal;
import com.hexahome.application.port.in.PropertyUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.hexahome.application.dto.lead.ContactRevealResponseDto;
import com.hexahome.application.port.in.LeadUseCase;
import com.hexahome.application.port.in.PropertyUseCase;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/properties")
@Tag(name = "Properties", description = "Property discovery, search filters, and listing submission")
public class PropertyController {

    private final PropertyUseCase propertyService;
    private final LeadUseCase leadService;

    public PropertyController(PropertyUseCase propertyService, LeadUseCase leadService) {
        this.propertyService = propertyService;
        this.leadService = leadService;
    }

    @GetMapping({"", "/search"})
    @Operation(summary = "Search properties with filters")
    public ResponseEntity<ApiResponse<Page<PropertySummaryDto>>> searchProperties(
            @Valid @ModelAttribute PropertyFilterRequest filter) {
        Page<PropertySummaryDto> results = propertyService.searchProperties(filter);
        return ResponseEntity.ok(ApiResponse.success("Properties retrieved successfully", results));
    }

    @GetMapping("/featured")
    @Operation(summary = "Get featured properties by city")
    public ResponseEntity<ApiResponse<List<PropertySummaryDto>>> getFeaturedProperties(
            @RequestParam(defaultValue = "coimbatore") String city,
            @RequestParam(defaultValue = "RENT") String adType,
            @RequestParam(defaultValue = "6") int limit) {
        List<PropertySummaryDto> featured = propertyService.getFeaturedCollection(city, adType, limit);
        return ResponseEntity.ok(ApiResponse.success("Featured properties retrieved successfully", featured));
    }

    @GetMapping("/hot-deals")
    @Operation(summary = "Get hot deal properties")
    public ResponseEntity<ApiResponse<List<PropertySummaryDto>>> getHotDeals(
            @RequestParam(defaultValue = "6") int limit) {
        List<PropertySummaryDto> hotDeals = propertyService.getHotDeals(limit);
        return ResponseEntity.ok(ApiResponse.success("Hot deals retrieved successfully", hotDeals));
    }

    @GetMapping("/my-properties")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get properties posted by authenticated user")
    public ResponseEntity<ApiResponse<Page<PropertySummaryDto>>> getMyProperties(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<PropertySummaryDto> properties = propertyService.getMyProperties(principal.getId(), page, size);
        return ResponseEntity.ok(ApiResponse.success("My properties retrieved successfully", properties));
    }

    @GetMapping("/{slugOrId}")
    @Operation(summary = "Get property details by slug or ID")
    public ResponseEntity<ApiResponse<PropertyDetailDto>> getPropertyDetail(@PathVariable String slugOrId) {
        PropertyDetailDto property = propertyService.getPropertyBySlugOrId(slugOrId);
        return ResponseEntity.ok(ApiResponse.success("Property retrieved successfully", property));
    }

    @PostMapping("/{id}/reveal-contact")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Reveal owner contact details", description = "Unmasks owner phone and email, deducting 1 credit from subscription quota")
    public ResponseEntity<ApiResponse<ContactRevealResponseDto>> revealOwnerContact(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id) {
        ContactRevealResponseDto reveal = leadService.revealOwnerContact(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Owner contact revealed successfully", reveal));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Post a new property listing")
    public ResponseEntity<ApiResponse<PropertyDetailDto>> createProperty(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreatePropertyRequest request) {
        UUID ownerId = principal != null ? principal.getId() : null;
        PropertyDetailDto created = propertyService.createProperty(ownerId, request);
        return new ResponseEntity<>(ApiResponse.success("Property posted successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("@securityEvaluator.isPropertyOwnerOrAdmin(#id, authentication)")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update an existing property listing (Owner or Admin)")
    public ResponseEntity<ApiResponse<PropertyDetailDto>> updateProperty(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreatePropertyRequest request) {
        UUID requesterId = principal != null ? principal.getId() : null;
        PropertyDetailDto updated = propertyService.updateProperty(id, requesterId, request);
        return ResponseEntity.ok(ApiResponse.success("Property updated successfully", updated));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("@securityEvaluator.isPropertyOwnerOrAdmin(#id, authentication)")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Partially update an existing property listing (Owner or Admin)")
    public ResponseEntity<ApiResponse<PropertyDetailDto>> patchProperty(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody CreatePropertyRequest request) {
        UUID requesterId = principal != null ? principal.getId() : null;
        PropertyDetailDto updated = propertyService.updateProperty(id, requesterId, request);
        return ResponseEntity.ok(ApiResponse.success("Property updated successfully", updated));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("@securityEvaluator.isPropertyOwnerOrAdmin(#id, authentication)")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update property status (e.g. ACTIVE, SOLD, RENTED, INACTIVE)")
    public ResponseEntity<ApiResponse<PropertyDetailDto>> updatePropertyStatus(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam String status) {
        UUID requesterId = principal != null ? principal.getId() : null;
        PropertyDetailDto updated = propertyService.updatePropertyStatus(id, requesterId, status);
        return ResponseEntity.ok(ApiResponse.success("Property status updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@securityEvaluator.isPropertyOwnerOrAdmin(#id, authentication)")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete an existing property listing (Owner or Admin)")
    public ResponseEntity<ApiResponse<Void>> deleteProperty(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal) {
        UUID requesterId = principal != null ? principal.getId() : null;
        propertyService.deleteProperty(id, requesterId);
        return ResponseEntity.ok(ApiResponse.success("Property deleted successfully", null));
    }
}
