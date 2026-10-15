package com.hexahome.presentation.controller;

import com.hexahome.presentation.response.ApiResponse;
import com.hexahome.application.dto.location.CityDto;
import com.hexahome.application.dto.location.LocalityDto;
import com.hexahome.application.service.LocationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cities")
@Tag(name = "Cities & Locations", description = "Endpoints for discovering active cities, regions, and localities")
public class CityController {

    private final LocationService locationService;

    public CityController(LocationService locationService) {
        this.locationService = locationService;
    }

    @GetMapping
    @Operation(summary = "List all active cities", description = "Returns all active platform cities ordered by display hierarchy with real-time active listing counts")
    public ResponseEntity<ApiResponse<List<CityDto>>> getAllCities() {
        List<CityDto> cities = locationService.getAllActiveCities();
        return ResponseEntity.ok(ApiResponse.success("Cities retrieved successfully", cities));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Get city by slug", description = "Returns details and coordinates of a city by its slug (e.g. 'coimbatore', 'ahmedabad')")
    public ResponseEntity<ApiResponse<CityDto>> getCityBySlug(@PathVariable String slug) {
        CityDto city = locationService.getCityBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success("City retrieved successfully", city));
    }

    @GetMapping("/{slug}/localities")
    @Operation(summary = "List localities in a city", description = "Returns all localities, postal codes, and coordinates within a specified city")
    public ResponseEntity<ApiResponse<List<LocalityDto>>> getLocalitiesByCity(@PathVariable String slug) {
        List<LocalityDto> localities = locationService.getLocalitiesByCitySlug(slug);
        return ResponseEntity.ok(ApiResponse.success("Localities retrieved successfully", localities));
    }

    @GetMapping("/{slug}/localities/{localitySlug}")
    @Operation(summary = "Get specific locality details", description = "Returns details of a specific locality by its slug within the parent city")
    public ResponseEntity<ApiResponse<LocalityDto>> getLocalityBySlug(
            @PathVariable String slug,
            @PathVariable String localitySlug) {
        LocalityDto locality = locationService.getLocalityByCitySlugAndLocalitySlug(slug, localitySlug);
        return ResponseEntity.ok(ApiResponse.success("Locality retrieved successfully", locality));
    }
}
