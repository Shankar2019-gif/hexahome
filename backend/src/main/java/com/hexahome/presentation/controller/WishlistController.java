package com.hexahome.presentation.controller;

import com.hexahome.presentation.response.ApiResponse;
import com.hexahome.application.dto.engagement.WishlistStatusDto;
import com.hexahome.application.dto.property.PropertySummaryDto;
import com.hexahome.infrastructure.security.UserPrincipal;
import com.hexahome.application.service.WishlistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/wishlists")
@Tag(name = "User Wishlist & Bookmarks", description = "Endpoints for bookmarking properties and accessing saved listings")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @PostMapping("/{propertyId}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Save property to wishlist", description = "Adds the specified property to authenticated user's bookmarks")
    public ResponseEntity<ApiResponse<WishlistStatusDto>> addToWishlist(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID propertyId) {
        WishlistStatusDto status = wishlistService.addToWishlist(principal.getId(), propertyId);
        return ResponseEntity.ok(ApiResponse.success("Property added to wishlist", status));
    }

    @DeleteMapping("/{propertyId}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Remove property from wishlist", description = "Removes the specified property from authenticated user's bookmarks")
    public ResponseEntity<ApiResponse<WishlistStatusDto>> removeFromWishlist(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID propertyId) {
        WishlistStatusDto status = wishlistService.removeFromWishlist(principal.getId(), propertyId);
        return ResponseEntity.ok(ApiResponse.success("Property removed from wishlist", status));
    }

    @GetMapping("/check/{propertyId}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Check if property is in wishlist", description = "Returns true if the authenticated user has bookmarked this property")
    public ResponseEntity<ApiResponse<WishlistStatusDto>> checkWishlist(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID propertyId) {
        WishlistStatusDto status = wishlistService.checkWishlist(principal.getId(), propertyId);
        return ResponseEntity.ok(ApiResponse.success(status.getMessage(), status));
    }

    @GetMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get user's saved wishlist properties", description = "Returns paginated list of properties saved by the authenticated user")
    public ResponseEntity<ApiResponse<Page<PropertySummaryDto>>> getUserWishlist(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<PropertySummaryDto> results = wishlistService.getUserWishlist(principal.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.success("Wishlist properties retrieved successfully", results));
    }
}
