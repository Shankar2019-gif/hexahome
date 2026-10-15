package com.hexahome.infrastructure.security;

import com.hexahome.domain.exception.ResourceNotFoundException;
import com.hexahome.persistence.entity.Property;
import com.hexahome.persistence.entity.PropertyImage;
import com.hexahome.persistence.entity.Role;
import com.hexahome.persistence.entity.User;
import com.hexahome.persistence.repository.PropertyImageRepository;
import com.hexahome.persistence.repository.PropertyRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ResourceAuthorizationEvaluatorTest {

    @Mock
    private PropertyRepository propertyRepository;
    @Mock
    private PropertyImageRepository propertyImageRepository;

    private ResourceAuthorizationEvaluator evaluator;

    private UUID ownerId;
    private UUID otherUserId;
    private UUID propertyId;
    private Property property;

    @BeforeEach
    void setUp() {
        evaluator = new ResourceAuthorizationEvaluator(propertyRepository, propertyImageRepository);

        ownerId = UUID.randomUUID();
        otherUserId = UUID.randomUUID();
        propertyId = UUID.randomUUID();

        User owner = new User();
        owner.setId(ownerId);
        owner.setPhone("9876543210");

        property = new Property();
        property.setId(propertyId);
        property.setOwner(owner);
    }

    private Authentication createUserAuth(UUID userId, String... roles) {
        UserPrincipal principal = new UserPrincipal(
                userId,
                "9876543210",
                "user@example.com",
                true,
                Arrays.stream(roles).map(SimpleGrantedAuthority::new).toList()
        );
        return new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
    }

    private Authentication createAdminAuth(UUID adminId) {
        AdminPrincipal principal = new AdminPrincipal(
                adminId,
                "admin",
                "admin@hexahome.in",
                "Super Administrator",
                "SUPER_ADMIN",
                true,
                List.of(new SimpleGrantedAuthority("ROLE_SUPER_ADMIN"))
        );
        return new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
    }

    @Test
    @DisplayName("Owner is authorized to modify their own property")
    void testOwnerAuthorized() {
        when(propertyRepository.findById(propertyId)).thenReturn(Optional.of(property));
        Authentication auth = createUserAuth(ownerId, "ROLE_USER", "ROLE_OWNER");

        boolean result = evaluator.isPropertyOwnerOrAdmin(propertyId, auth);
        assertTrue(result, "Owner must be allowed to modify their property");
    }

    @Test
    @DisplayName("Non-owner user is forbidden from modifying another user's property")
    void testNonOwnerForbidden() {
        when(propertyRepository.findById(propertyId)).thenReturn(Optional.of(property));
        Authentication auth = createUserAuth(otherUserId, "ROLE_USER");

        boolean result = evaluator.isPropertyOwnerOrAdmin(propertyId, auth);
        assertFalse(result, "Non-owner must NOT be allowed to modify property");
    }

    @Test
    @DisplayName("Admin user is authorized to modify any property")
    void testAdminAuthorized() {
        Authentication auth = createAdminAuth(UUID.randomUUID());

        boolean result = evaluator.isPropertyOwnerOrAdmin(propertyId, auth);
        assertTrue(result, "Admin must be authorized to modify any property");
        verify(propertyRepository, never()).findById(any());
    }

    @Test
    @DisplayName("Unauthenticated request is rejected")
    void testUnauthenticatedRejected() {
        assertFalse(evaluator.isPropertyOwnerOrAdmin(propertyId, null));
    }

    @Test
    @DisplayName("Property not found throws ResourceNotFoundException")
    void testPropertyNotFoundThrows() {
        when(propertyRepository.findById(propertyId)).thenReturn(Optional.empty());
        Authentication auth = createUserAuth(ownerId, "ROLE_USER");

        assertThrows(ResourceNotFoundException.class, () ->
                evaluator.isPropertyOwnerOrAdmin(propertyId, auth)
        );
    }

    @Test
    @DisplayName("Owner can delete media associated with their property")
    void testOwnerCanDeleteMedia() {
        String mediaUrl = "https://assets.hexahome.in/properties/img1.webp";
        PropertyImage img = new PropertyImage();
        img.setImageUrl(mediaUrl);
        img.setProperty(property);

        when(propertyImageRepository.findAllByImageUrlOrThumbnailUrl(mediaUrl, mediaUrl))
                .thenReturn(List.of(img));

        Authentication auth = createUserAuth(ownerId, "ROLE_USER");
        assertTrue(evaluator.canDeleteMedia(mediaUrl, auth));
    }

    @Test
    @DisplayName("Non-owner cannot delete media associated with someone else's property")
    void testNonOwnerCannotDeleteMedia() {
        String mediaUrl = "https://assets.hexahome.in/properties/img1.webp";
        PropertyImage img = new PropertyImage();
        img.setImageUrl(mediaUrl);
        img.setProperty(property);

        when(propertyImageRepository.findAllByImageUrlOrThumbnailUrl(mediaUrl, mediaUrl))
                .thenReturn(List.of(img));

        Authentication auth = createUserAuth(otherUserId, "ROLE_USER");
        assertFalse(evaluator.canDeleteMedia(mediaUrl, auth));
    }

    @Test
    @DisplayName("Admin can delete any media even if not the property owner")
    void testAdminCanDeleteAnyMedia() {
        String mediaUrl = "https://assets.hexahome.in/properties/img1.webp";
        Authentication auth = createAdminAuth(UUID.randomUUID());

        assertTrue(evaluator.canDeleteMedia(mediaUrl, auth));
    }

    @Test
    @DisplayName("Unattached temporary media can be deleted by authenticated user")
    void testUnattachedMediaCanBeDeleted() {
        String mediaUrl = "https://assets.hexahome.in/temp/img1.webp";
        when(propertyImageRepository.findAllByImageUrlOrThumbnailUrl(mediaUrl, mediaUrl))
                .thenReturn(Collections.emptyList());

        Authentication auth = createUserAuth(otherUserId, "ROLE_USER");
        assertTrue(evaluator.canDeleteMedia(mediaUrl, auth));
    }
}
