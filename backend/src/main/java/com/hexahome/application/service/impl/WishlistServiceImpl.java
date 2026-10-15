package com.hexahome.application.service.impl;

import com.hexahome.domain.exception.ResourceNotFoundException;
import com.hexahome.application.dto.engagement.WishlistStatusDto;
import com.hexahome.application.dto.property.PropertySummaryDto;
import com.hexahome.persistence.entity.Property;
import com.hexahome.persistence.entity.User;
import com.hexahome.persistence.entity.Wishlist;
import com.hexahome.persistence.repository.PropertyRepository;
import com.hexahome.persistence.repository.UserRepository;
import com.hexahome.persistence.repository.WishlistRepository;
import com.hexahome.application.service.WishlistService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    public WishlistServiceImpl(
            WishlistRepository wishlistRepository,
            PropertyRepository propertyRepository,
            UserRepository userRepository) {
        this.wishlistRepository = wishlistRepository;
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public WishlistStatusDto addToWishlist(UUID userId, UUID propertyId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", propertyId));

        if (!wishlistRepository.existsByUserIdAndPropertyId(userId, propertyId)) {
            wishlistRepository.save(new Wishlist(user, property));
        }

        long count = wishlistRepository.countByPropertyId(propertyId);
        return new WishlistStatusDto(propertyId, true, count, "Property saved to wishlist");
    }

    @Override
    @Transactional
    public WishlistStatusDto removeFromWishlist(UUID userId, UUID propertyId) {
        if (!propertyRepository.existsById(propertyId)) {
            throw new ResourceNotFoundException("Property", "id", propertyId);
        }

        wishlistRepository.deleteByUserIdAndPropertyId(userId, propertyId);
        long count = wishlistRepository.countByPropertyId(propertyId);
        return new WishlistStatusDto(propertyId, false, count, "Property removed from wishlist");
    }

    @Override
    @Transactional(readOnly = true)
    public WishlistStatusDto checkWishlist(UUID userId, UUID propertyId) {
        boolean exists = wishlistRepository.existsByUserIdAndPropertyId(userId, propertyId);
        long count = wishlistRepository.countByPropertyId(propertyId);
        return new WishlistStatusDto(propertyId, exists, count, exists ? "In wishlist" : "Not in wishlist");
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PropertySummaryDto> getUserWishlist(UUID userId, Pageable pageable) {
        return wishlistRepository.findAllByUserIdWithDetails(userId, pageable)
                .map(w -> PropertySummaryDto.fromEntity(w.getProperty()));
    }
}
