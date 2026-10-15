package com.hexahome.application.port.in;

import com.hexahome.application.dto.lead.ContactRevealResponseDto;
import com.hexahome.application.dto.lead.CreateLeadRequest;
import com.hexahome.application.dto.lead.LeadResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

/**
 * Onion Architecture Inbound Port: Lead Generation & Contact Reveal Quota Use Case.
 */
public interface LeadUseCase {

    LeadResponseDto createLead(UUID seekerId, CreateLeadRequest request);

    ContactRevealResponseDto revealOwnerContact(UUID userId, UUID propertyId);

    Page<LeadResponseDto> getOwnerLeads(UUID ownerId, Pageable pageable);

    Page<LeadResponseDto> getSeekerInquiries(UUID seekerId, Pageable pageable);
}
