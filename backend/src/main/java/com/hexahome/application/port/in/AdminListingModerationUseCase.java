package com.hexahome.application.port.in;

import com.hexahome.application.dto.admin.moderation.*;
import org.springframework.data.domain.Page;

import java.util.UUID;

/**
 * Onion Architecture Inbound Port: Administrative Property Moderation.
 */
public interface AdminListingModerationUseCase {

    Page<AdminPropertySummaryDto> searchListings(AdminPropertyFilterRequest filter);

    AdminPropertyDetailDto getListingDetail(UUID propertyId);

    void approveListing(UUID propertyId, UUID adminId, String ipAddress);

    void rejectListing(UUID propertyId, String reason, UUID adminId, String ipAddress);

    void expireListing(UUID propertyId, UUID adminId, String ipAddress);

    boolean toggleHotDeal(UUID propertyId, UUID adminId, String ipAddress);

    boolean toggleVerified(UUID propertyId, UUID adminId, String ipAddress);

    void deleteListing(UUID propertyId, UUID adminId, String ipAddress);

    BulkListingActionResultDto executeBulkAction(BulkListingActionRequest request, UUID adminId, String ipAddress);
}
