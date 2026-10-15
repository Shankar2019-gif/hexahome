package com.hexahome.presentation.controller;

import com.hexahome.presentation.response.ApiResponse;
import com.hexahome.application.dto.meta.AmenityDto;
import com.hexahome.application.service.MetaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/meta")
@Tag(name = "Master Metadata", description = "Endpoints for platform master lookups including amenities and property attributes")
public class MetaController {

    private final MetaService metaService;

    public MetaController(MetaService metaService) {
        this.metaService = metaService;
    }

    @GetMapping("/amenities")
    @Operation(summary = "List all platform amenities", description = "Returns the complete catalog of verified amenities grouped by category")
    public ResponseEntity<ApiResponse<List<AmenityDto>>> getAllAmenities() {
        List<AmenityDto> amenities = metaService.getAllAmenities();
        return ResponseEntity.ok(ApiResponse.success("Amenities retrieved successfully", amenities));
    }

    @GetMapping("/amenities/category/{category}")
    @Operation(summary = "List amenities by category", description = "Filters amenities by category such as BUILDING, PARKING, UTILITIES, LIFESTYLE")
    public ResponseEntity<ApiResponse<List<AmenityDto>>> getAmenitiesByCategory(@PathVariable String category) {
        List<AmenityDto> amenities = metaService.getAmenitiesByCategory(category);
        return ResponseEntity.ok(ApiResponse.success("Amenities retrieved successfully", amenities));
    }
}
