package com.hexahome.infrastructure.security;

import com.hexahome.domain.exception.ForbiddenException;
import com.hexahome.domain.exception.ResourceNotFoundException;
import com.hexahome.persistence.entity.Property;
import com.hexahome.persistence.entity.PropertyImage;
import com.hexahome.persistence.repository.PropertyImageRepository;
import com.hexahome.persistence.repository.PropertyRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

/**
 * Security Authorization Evaluator for Resource Ownership and Access Control.
 * Used in @PreAuthorize SpEL expressions and programmatic authorization checks.
 */
@Component("securityEvaluator")
public class ResourceAuthorizationEvaluator {

    private static final Logger log = LoggerFactory.getLogger(ResourceAuthorizationEvaluator.class);

    private final PropertyRepository propertyRepository;
    private final PropertyImageRepository propertyImageRepository;

    public ResourceAuthorizationEvaluator(
            PropertyRepository propertyRepository,
            PropertyImageRepository propertyImageRepository) {
        this.propertyRepository = propertyRepository;
        this.propertyImageRepository = propertyImageRepository;
    }

    /**
     * Verifies that the authenticated principal is either the owner of the property or possesses administrative privileges.
     * Throws ResourceNotFoundException if property does not exist.
     * Returns false if unauthorized.
     */
    public boolean isPropertyOwnerOrAdmin(UUID propertyId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        if (isAdmin(authentication)) {
            return true;
        }

        UUID currentUserId = extractUserId(authentication);
        if (currentUserId == null) {
            return false;
        }

        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", propertyId));

        boolean isOwner = property.getOwner() != null && currentUserId.equals(property.getOwner().getId());
        if (!isOwner) {
            log.warn("Access denied: User {} is not the owner of property {}", currentUserId, propertyId);
        }
        return isOwner;
    }

    /**
     * Verifies that the authenticated principal can delete the media file.
     * If the media URL is linked to a property, the user must own the property or be an administrator.
     */
    public boolean canDeleteMedia(String url, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        if (isAdmin(authentication)) {
            return true;
        }

        UUID currentUserId = extractUserId(authentication);
        if (currentUserId == null) {
            return false;
        }

        List<PropertyImage> images = propertyImageRepository.findAllByImageUrlOrThumbnailUrl(url, url);
        if (images.isEmpty()) {
            // Unattached or temporary media file uploaded by authenticated user
            return true;
        }

        for (PropertyImage image : images) {
            Property property = image.getProperty();
            if (property != null && property.getOwner() != null) {
                if (!currentUserId.equals(property.getOwner().getId())) {
                    log.warn("Access denied: User {} attempted to delete media {} belonging to property {} owned by {}",
                            currentUserId, url, property.getId(), property.getOwner().getId());
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Checks if the authentication contains an administrative or moderator role.
     */
    public boolean isAdmin(Authentication authentication) {
        if (authentication == null) {
            return false;
        }
        for (GrantedAuthority authority : authentication.getAuthorities()) {
            String role = authority.getAuthority();
            if ("ROLE_ADMIN".equals(role)
                    || "ROLE_SUPER_ADMIN".equals(role)
                    || "ROLE_MODERATOR".equals(role)
                    || "SUPER_ADMIN".equals(role)
                    || "MODERATOR".equals(role)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Extracts user UUID from principal (supports both UserPrincipal and AdminPrincipal).
     */
    public UUID extractUserId(Authentication authentication) {
        if (authentication == null) {
            return null;
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserPrincipal up) {
            return up.getId();
        }
        if (principal instanceof AdminPrincipal ap) {
            return ap.getId();
        }
        return null;
    }
}
