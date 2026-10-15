package com.hexahome.application.service;

import com.hexahome.application.dto.admin.moderation.*;
import com.hexahome.application.dto.meta.AmenityDto;
import com.hexahome.application.dto.property.PropertyImageDto;
import com.hexahome.application.port.in.AdminListingModerationUseCase;
import com.hexahome.application.port.out.AuditLogPort;
import com.hexahome.domain.exception.ResourceNotFoundException;
import com.hexahome.domain.policy.ListingModerationPolicy;
import com.hexahome.persistence.entity.Property;
import com.hexahome.persistence.entity.PropertyImage;
import com.hexahome.persistence.repository.PropertyRepository;
import com.hexahome.persistence.specification.AdminPropertySpecification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminListingModerationService implements AdminListingModerationUseCase {

    private static final Logger log = LoggerFactory.getLogger(AdminListingModerationService.class);
    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("createdAt", "price", "title", "status", "updatedAt");

    private final PropertyRepository propertyRepository;
    private final AuditLogPort auditLogPort;

    public AdminListingModerationService(
            PropertyRepository propertyRepository,
            AuditLogPort auditLogPort) {
        this.propertyRepository = propertyRepository;
        this.auditLogPort = auditLogPort;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdminPropertySummaryDto> searchListings(AdminPropertyFilterRequest filter) {
        String safeSort = ALLOWED_SORT_FIELDS.contains(filter.getSortBy()) ? filter.getSortBy() : "createdAt";
        Sort.Direction direction = "ASC".equalsIgnoreCase(filter.getSortDirection()) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(filter.getPage(), filter.getSize(), Sort.by(direction, safeSort));

        Specification<Property> spec = AdminPropertySpecification.build(filter);
        Page<Property> propertiesPage = propertyRepository.findAll(spec, pageable);

        return propertiesPage.map(this::mapToSummaryDto);
    }

    @Override
    @Transactional(readOnly = true)
    public AdminPropertyDetailDto getListingDetail(UUID propertyId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with ID: " + propertyId));

        return mapToDetailDto(property);
    }

    @Override
    @Transactional
    public void approveListing(UUID propertyId, UUID adminId, String ipAddress) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with ID: " + propertyId));

        String previousStatus = property.getStatus();
        ListingModerationPolicy.validateApproval(previousStatus);

        property.setStatus(ListingModerationPolicy.STATUS_ACTIVE);
        property.setVerified(true);
        propertyRepository.save(property);

        auditLogPort.recordAction(
                adminId,
                "APPROVE_LISTING",
                "Property",
                propertyId.toString(),
                previousStatus,
                ListingModerationPolicy.STATUS_ACTIVE,
                "Listing verified and approved",
                ipAddress,
                "SUCCESS"
        );
        log.info("Listing approved: propertyId={} by adminId={}", propertyId, adminId);
    }

    @Override
    @Transactional
    public void rejectListing(UUID propertyId, String reason, UUID adminId, String ipAddress) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with ID: " + propertyId));

        String previousStatus = property.getStatus();
        ListingModerationPolicy.validateRejection(previousStatus, reason);

        property.setStatus(ListingModerationPolicy.STATUS_REJECTED);
        property.setVerified(false);
        propertyRepository.save(property);

        auditLogPort.recordAction(
                adminId,
                "REJECT_LISTING",
                "Property",
                propertyId.toString(),
                previousStatus,
                ListingModerationPolicy.STATUS_REJECTED,
                reason,
                ipAddress,
                "SUCCESS"
        );
        log.info("Listing rejected: propertyId={} reason='{}' by adminId={}", propertyId, reason, adminId);
    }

    @Override
    @Transactional
    public void expireListing(UUID propertyId, UUID adminId, String ipAddress) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with ID: " + propertyId));

        String previousStatus = property.getStatus();
        ListingModerationPolicy.validateExpiration(previousStatus);

        property.setStatus(ListingModerationPolicy.STATUS_INACTIVE);
        propertyRepository.save(property);

        auditLogPort.recordAction(
                adminId,
                "EXPIRE_LISTING",
                "Property",
                propertyId.toString(),
                previousStatus,
                ListingModerationPolicy.STATUS_INACTIVE,
                "Listing deactivated / expired",
                ipAddress,
                "SUCCESS"
        );
        log.info("Listing expired: propertyId={} by adminId={}", propertyId, adminId);
    }

    @Override
    @Transactional
    public boolean toggleHotDeal(UUID propertyId, UUID adminId, String ipAddress) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with ID: " + propertyId));

        boolean previousState = property.isHotDeal();
        boolean newState = !previousState;

        property.setHotDeal(newState);
        propertyRepository.save(property);

        auditLogPort.recordAction(
                adminId,
                "TOGGLE_HOT_DEAL",
                "Property",
                propertyId.toString(),
                String.valueOf(previousState),
                String.valueOf(newState),
                "Hot deal badge toggled to " + newState,
                ipAddress,
                "SUCCESS"
        );
        log.info("Listing hot deal toggled: propertyId={} newState={} by adminId={}", propertyId, newState, adminId);
        return newState;
    }

    @Override
    @Transactional
    public BulkListingActionResultDto executeBulkAction(BulkListingActionRequest request, UUID adminId, String ipAddress) {
        ListingModerationPolicy.validateBulkAction(request.getPropertyIds(), request.getAction(), request.getReason());

        String action = request.getAction().trim().toUpperCase();
        int succeeded = 0;
        int failed = 0;
        List<String> errors = new ArrayList<>();

        for (UUID propId : request.getPropertyIds()) {
            try {
                switch (action) {
                    case "APPROVE" -> approveListing(propId, adminId, ipAddress);
                    case "REJECT" -> rejectListing(propId, request.getReason(), adminId, ipAddress);
                    case "EXPIRE" -> expireListing(propId, adminId, ipAddress);
                }
                succeeded++;
            } catch (Exception e) {
                failed++;
                errors.add("Property " + propId + ": " + e.getMessage());
                log.warn("Failed bulk item {}: {}", propId, e.getMessage());
            }
        }

        auditLogPort.recordAction(
                adminId,
                "BULK_MODERATION",
                "Property",
                action,
                null,
                "Succeeded: " + succeeded + ", Failed: " + failed,
                request.getReason(),
                ipAddress,
                failed > 0 ? "PARTIAL_SUCCESS" : "SUCCESS"
        );

        return new BulkListingActionResultDto(
                request.getPropertyIds().size(),
                succeeded,
                failed,
                errors
        );
    }

    private AdminPropertySummaryDto mapToSummaryDto(Property property) {
        AdminPropertySummaryDto dto = new AdminPropertySummaryDto();
        dto.setId(property.getId());
        dto.setShortId(property.getShortId());
        dto.setSlug(property.getSlug());
        dto.setTitle(property.getTitle());
        dto.setAdType(property.getAdType());
        dto.setPropertyType(property.getPropertyType());
        dto.setPrice(property.getPrice());
        dto.setDeposit(property.getDeposit());
        dto.setBhk(property.getBhk());
        dto.setCityName(property.getCity() != null ? property.getCity().getName() : "");
        dto.setLocalityName(property.getLocality() != null ? property.getLocality().getName() : "");
        dto.setAddress(property.getAddress());
        dto.setStatus(property.getStatus());
        dto.setVerified(property.isVerified());
        dto.setHotDeal(property.isHotDeal());
        dto.setCreatedAt(property.getCreatedAt());

        if (property.getOwner() != null) {
            dto.setOwnerId(property.getOwner().getId());
            dto.setOwnerName(property.getOwner().getName());
            dto.setOwnerPhone(property.getOwner().getPhone());
        }

        if (property.getImages() != null && !property.getImages().isEmpty()) {
            dto.setCoverImageUrl(property.getImages().get(0).getImageUrl());
        }

        return dto;
    }

    private AdminPropertyDetailDto mapToDetailDto(Property property) {
        AdminPropertyDetailDto dto = new AdminPropertyDetailDto();
        dto.setId(property.getId());
        dto.setShortId(property.getShortId());
        dto.setSlug(property.getSlug());
        dto.setTitle(property.getTitle());
        dto.setDescription(property.getDescription());
        dto.setAdType(property.getAdType());
        dto.setPropertyType(property.getPropertyType());

        dto.setPrice(property.getPrice());
        dto.setDeposit(property.getDeposit());
        dto.setMaintenanceCharges(property.getMaintenanceCharges());
        dto.setMaintenanceIncluded(property.isMaintenanceIncluded());

        dto.setBhk(property.getBhk());
        dto.setBedrooms(property.getBedrooms());
        dto.setBathrooms(property.getBathrooms());
        dto.setBalconies(property.getBalconies());
        dto.setBuiltUpArea(property.getBuiltUpArea());
        dto.setCarpetArea(property.getCarpetArea());

        dto.setFurnishing(property.getFurnishing());
        dto.setPreferredTenant(property.getPreferredTenant());
        dto.setFacing(property.getFacing());
        dto.setFloorNumber(property.getFloorNumber());
        dto.setTotalFloors(property.getTotalFloors());

        dto.setAvailableFrom(property.getAvailableFrom());
        dto.setLatitude(property.getLatitude());
        dto.setLongitude(property.getLongitude());
        dto.setAddress(property.getAddress());

        dto.setStatus(property.getStatus());
        dto.setVerified(property.isVerified());
        dto.setZeroBrokerage(property.isZeroBrokerage());
        dto.setHotDeal(property.isHotDeal());

        if (property.getCity() != null) {
            dto.setCityId(property.getCity().getId());
            dto.setCityName(property.getCity().getName());
        }

        if (property.getLocality() != null) {
            dto.setLocalityId(property.getLocality().getId());
            dto.setLocalityName(property.getLocality().getName());
        }

        if (property.getOwner() != null) {
            dto.setOwnerId(property.getOwner().getId());
            dto.setOwnerName(property.getOwner().getName());
            dto.setOwnerPhone(property.getOwner().getPhone());
            dto.setOwnerEmail(property.getOwner().getEmail());
        }

        if (property.getImages() != null) {
            List<PropertyImageDto> imageDtos = property.getImages().stream()
                    .map(img -> new PropertyImageDto(
                            img.getId(),
                            img.getImageUrl(),
                            img.getThumbnailUrl(),
                            img.getCaption(),
                            img.getDisplayOrder(),
                            img.isCover()
                    ))
                    .collect(Collectors.toList());
            dto.setImages(imageDtos);
        }

        if (property.getAmenities() != null) {
            List<AmenityDto> amenityDtos = property.getAmenities().stream()
                    .map(a -> new AmenityDto(
                            a.getId(),
                            a.getCode(),
                            a.getName(),
                            a.getIconUrl(),
                            a.getCategory()
                    ))
                    .collect(Collectors.toList());
            dto.setAmenities(amenityDtos);
        }

        dto.setCreatedAt(property.getCreatedAt());
        dto.setUpdatedAt(property.getUpdatedAt());

        return dto;
    }
}
