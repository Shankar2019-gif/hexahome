package com.hexahome.presentation.controller;

import com.hexahome.presentation.response.ApiResponse;
import com.hexahome.application.dto.content.ProjectDetailDto;
import com.hexahome.application.dto.content.ProjectSummaryDto;
import com.hexahome.application.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/projects")
@Tag(name = "Builder Projects & New Developments", description = "Endpoints for discovering new residential projects and gated communities")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    @Operation(summary = "Search builder projects", description = "Retrieves builder projects filtered by city and construction status (UNDER_CONSTRUCTION, READY_TO_MOVE, NEW_LAUNCH)")
    public ResponseEntity<ApiResponse<List<ProjectSummaryDto>>> searchProjects(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String status) {
        List<ProjectSummaryDto> projects = projectService.getProjects(city, status);
        return ResponseEntity.ok(ApiResponse.success("Projects retrieved successfully", projects));
    }

    @GetMapping("/featured")
    @Operation(summary = "Get featured builder projects", description = "Returns top promoted new builder developments")
    public ResponseEntity<ApiResponse<List<ProjectSummaryDto>>> getFeaturedProjects() {
        List<ProjectSummaryDto> featured = projectService.getFeaturedProjects();
        return ResponseEntity.ok(ApiResponse.success("Featured projects retrieved successfully", featured));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Get project details by slug", description = "Retrieves full builder project specifications, RERA ID, and price configurations")
    public ResponseEntity<ApiResponse<ProjectDetailDto>> getProjectBySlug(@PathVariable String slug) {
        ProjectDetailDto project = projectService.getProjectBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success("Project details retrieved successfully", project));
    }
}
