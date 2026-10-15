package com.hexahome.application.service;

import com.hexahome.application.dto.engagement.WishlistStatusDto;
import com.hexahome.application.dto.property.PropertySummaryDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface WishlistService {

    WishlistStatusDto addToWishlist(UUID userId, UUID propertyId);

    WishlistStatusDto removeFromWishlist(UUID userId, UUID propertyId);

    WishlistStatusDto checkWishlist(UUID userId, UUID propertyId);

    Page<PropertySummaryDto> getUserWishlist(UUID userId, Pageable pageable);
}
