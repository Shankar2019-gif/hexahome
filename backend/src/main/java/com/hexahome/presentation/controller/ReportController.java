package com.hexahome.presentation.controller;

import com.hexahome.presentation.response.ApiResponse;
import com.hexahome.application.dto.engagement.CreateReportRequest;
import com.hexahome.application.dto.engagement.ReportResponseDto;
import com.hexahome.infrastructure.security.UserPrincipal;
import com.hexahome.application.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/reports")
@Tag(name = "Listing Abuse & Reports", description = "Endpoints for flagging fake listings, inaccurate details, and broker spam")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping
    @Operation(summary = "Report property listing abuse", description = "Submits an abuse report for inaccurate price, broker involvement, or already rented listing")
    public ResponseEntity<ApiResponse<ReportResponseDto>> createReport(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateReportRequest request) {
        UUID userId = principal != null ? principal.getId() : null;
        ReportResponseDto report = reportService.createReport(userId, request);
        return new ResponseEntity<>(ApiResponse.success("Report submitted successfully for moderation review", report), HttpStatus.CREATED);
    }
}
