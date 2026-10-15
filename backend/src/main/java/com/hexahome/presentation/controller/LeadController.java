package com.hexahome.presentation.controller;

import com.hexahome.presentation.response.ApiResponse;
import com.hexahome.application.dto.lead.ContactRevealResponseDto;
import com.hexahome.application.dto.lead.CreateLeadRequest;
import com.hexahome.application.dto.lead.LeadResponseDto;
import com.hexahome.infrastructure.security.UserPrincipal;
import com.hexahome.application.service.LeadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@Tag(name = "Leads & Contact Reveal", description = "Endpoints for submitting property inquiries and revealing owner contact details with quota tracking")
public class LeadController {

    private final LeadService leadService;

    public LeadController(LeadService leadService) {
        this.leadService = leadService;
    }

    @PostMapping("/api/v1/leads")
    @Operation(summary = "Submit a property inquiry / lead", description = "Submits an inquiry for a property. Can be sent by authenticated seekers or anonymous visitors with phone number verification.")
    public ResponseEntity<ApiResponse<LeadResponseDto>> submitLead(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateLeadRequest request) {
        UUID seekerId = principal != null ? principal.getId() : null;
        LeadResponseDto lead = leadService.createLead(seekerId, request);
        return new ResponseEntity<>(ApiResponse.success("Inquiry submitted successfully", lead), HttpStatus.CREATED);
    }

    @GetMapping("/api/v1/leads/my-leads")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get received leads for owner properties", description = "Returns paginated list of inquiries received for properties owned by the authenticated user")
    public ResponseEntity<ApiResponse<Page<LeadResponseDto>>> getMyLeads(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<LeadResponseDto> leads = leadService.getOwnerLeads(principal.getId(), PageRequest.of(Math.max(0, page), size));
        return ResponseEntity.ok(ApiResponse.success("Owner leads retrieved successfully", leads));
    }

    @GetMapping("/api/v1/leads/my-inquiries")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get inquiries and contact views initiated by authenticated buyer/tenant")
    public ResponseEntity<ApiResponse<Page<LeadResponseDto>>> getMyInquiries(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<LeadResponseDto> inquiries = leadService.getSeekerInquiries(principal.getId(), PageRequest.of(Math.max(0, page), size));
        return ResponseEntity.ok(ApiResponse.success("My inquiries retrieved successfully", inquiries));
    }

    @PostMapping("/api/v1/leads/reveal-contact")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Reveal owner phone number via request body", description = "Unmasks owner phone number using propertyId in JSON body, deducting 1 credit from subscription quota")
    public ResponseEntity<ApiResponse<ContactRevealResponseDto>> revealContactByBody(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody com.hexahome.application.dto.lead.RevealContactRequest request) {
        ContactRevealResponseDto reveal = leadService.revealOwnerContact(principal.getId(), request.getPropertyId());
        return ResponseEntity.ok(ApiResponse.success("Owner contact revealed successfully", reveal));
    }
}
