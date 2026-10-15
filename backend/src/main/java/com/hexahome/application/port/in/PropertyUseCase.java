package com.hexahome.application.port.in;

import com.hexahome.application.dto.property.CreatePropertyRequest;
import com.hexahome.application.dto.property.PropertyDetailDto;
import com.hexahome.application.dto.property.PropertyFilterRequest;
import com.hexahome.application.dto.property.PropertySummaryDto;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.UUID;

/**
 * Onion Architecture Inbound Port: Property Use Case.
 * Declares primary application use cases for listing search and creation.
 */
public interface PropertyUseCase {

    Page<PropertySummaryDto> searchProperties(PropertyFilterRequest filter);

    PropertyDetailDto getPropertyBySlugOrId(String identifier);

    List<PropertySummaryDto> getFeaturedCollection(String citySlug, String adType, int limit);

    List<PropertySummaryDto> getHotDeals(int limit);

    PropertyDetailDto createProperty(UUID ownerId, CreatePropertyRequest request);

    PropertyDetailDto updateProperty(UUID id, UUID requesterId, CreatePropertyRequest request);

    PropertyDetailDto updatePropertyStatus(UUID id, UUID requesterId, String status);

    Page<PropertySummaryDto> getMyProperties(UUID ownerId, int page, int size);

    void deleteProperty(UUID id, UUID requesterId);
}
