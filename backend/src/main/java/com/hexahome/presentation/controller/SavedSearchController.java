package com.hexahome.presentation.controller;

import com.hexahome.presentation.response.ApiResponse;
import com.hexahome.application.dto.engagement.SavedSearchDto;
import com.hexahome.application.dto.engagement.SavedSearchRequest;
import com.hexahome.infrastructure.security.UserPrincipal;
import com.hexahome.application.service.SavedSearchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/saved-searches")
@Tag(name = "Saved Searches & Alerts", description = "Endpoints for persisting custom search filters and setting up notification alerts")
public class SavedSearchController {

    private final SavedSearchService savedSearchService;

    public SavedSearchController(SavedSearchService savedSearchService) {
        this.savedSearchService = savedSearchService;
    }

    @PostMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Save property search filter", description = "Saves search criteria with optional WhatsApp/Email alerts for new matching properties")
    public ResponseEntity<ApiResponse<SavedSearchDto>> saveSearch(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody SavedSearchRequest request) {
        SavedSearchDto result = savedSearchService.saveSearch(principal.getId(), request);
        return new ResponseEntity<>(ApiResponse.success("Search saved successfully", result), HttpStatus.CREATED);
    }

    @GetMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "List user saved searches", description = "Returns all search filter queries saved by the authenticated user")
    public ResponseEntity<ApiResponse<List<SavedSearchDto>>> getUserSavedSearches(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<SavedSearchDto> searches = savedSearchService.getUserSavedSearches(principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Saved searches retrieved successfully", searches));
    }

    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete saved search", description = "Deletes a previously saved search filter query")
    public ResponseEntity<ApiResponse<Void>> deleteSavedSearch(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id) {
        savedSearchService.deleteSavedSearch(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Saved search deleted successfully", null));
    }
}
