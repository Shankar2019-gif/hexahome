package com.hexahome.application.service;

import com.hexahome.application.dto.admin.moderation.BulkListingActionRequest;
import com.hexahome.application.dto.admin.moderation.BulkListingActionResultDto;
import com.hexahome.application.port.out.AuditLogPort;
import com.hexahome.domain.exception.BadRequestException;
import com.hexahome.domain.policy.ListingModerationPolicy;
import com.hexahome.persistence.entity.City;
import com.hexahome.persistence.entity.Locality;
import com.hexahome.persistence.entity.Property;
import com.hexahome.persistence.entity.User;
import com.hexahome.persistence.repository.PropertyRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminListingModerationServiceTest {

    @Mock
    private PropertyRepository propertyRepository;

    @Mock
    private AuditLogPort auditLogPort;

    private AdminListingModerationService moderationService;
    private Property testProperty;
    private UUID propertyId;
    private UUID adminId;

    @BeforeEach
    void setUp() {
        moderationService = new AdminListingModerationService(
                propertyRepository,
                auditLogPort
        );

        propertyId = UUID.randomUUID();
        adminId = UUID.randomUUID();

        testProperty = new Property();
        testProperty.setId(propertyId);
        testProperty.setShortId("HEX123");
        testProperty.setSlug("hex-123-slug");
        testProperty.setTitle("2 BHK Luxury Flat");
        testProperty.setPrice(new BigDecimal("25000"));
        testProperty.setStatus(ListingModerationPolicy.STATUS_PENDING);
        testProperty.setVerified(false);
        testProperty.setHotDeal(false);

        City city = new City();
        city.setName("Coimbatore");
        testProperty.setCity(city);

        Locality locality = new Locality();
        locality.setName("RS Puram");
        testProperty.setLocality(locality);

        User owner = new User();
        owner.setId(UUID.randomUUID());
        owner.setName("John Doe");
        owner.setPhone("9876543210");
        testProperty.setOwner(owner);
    }

    @Test
    void approveListing_Success() {
        when(propertyRepository.findById(propertyId)).thenReturn(Optional.of(testProperty));

        moderationService.approveListing(propertyId, adminId, "127.0.0.1");

        assertEquals(ListingModerationPolicy.STATUS_ACTIVE, testProperty.getStatus());
        assertTrue(testProperty.isVerified());

        verify(propertyRepository).save(testProperty);
        verify(auditLogPort).recordAction(eq(adminId), eq("APPROVE_LISTING"), eq("Property"), eq(propertyId.toString()), eq(ListingModerationPolicy.STATUS_PENDING), eq(ListingModerationPolicy.STATUS_ACTIVE), anyString(), eq("127.0.0.1"), eq("SUCCESS"));
    }

    @Test
    void rejectListing_Success() {
        when(propertyRepository.findById(propertyId)).thenReturn(Optional.of(testProperty));

        moderationService.rejectListing(propertyId, "Incomplete KYC document", adminId, "127.0.0.1");

        assertEquals(ListingModerationPolicy.STATUS_REJECTED, testProperty.getStatus());
        assertFalse(testProperty.isVerified());

        verify(propertyRepository).save(testProperty);
        verify(auditLogPort).recordAction(eq(adminId), eq("REJECT_LISTING"), eq("Property"), eq(propertyId.toString()), eq(ListingModerationPolicy.STATUS_PENDING), eq(ListingModerationPolicy.STATUS_REJECTED), eq("Incomplete KYC document"), eq("127.0.0.1"), eq("SUCCESS"));
    }

    @Test
    void rejectListing_BlankReason_ThrowsBadRequestException() {
        when(propertyRepository.findById(propertyId)).thenReturn(Optional.of(testProperty));

        assertThrows(BadRequestException.class, () ->
                moderationService.rejectListing(propertyId, "   ", adminId, "127.0.0.1"));
    }

    @Test
    void expireListing_ActiveProperty_Success() {
        testProperty.setStatus(ListingModerationPolicy.STATUS_ACTIVE);
        when(propertyRepository.findById(propertyId)).thenReturn(Optional.of(testProperty));

        moderationService.expireListing(propertyId, adminId, "127.0.0.1");

        assertEquals(ListingModerationPolicy.STATUS_INACTIVE, testProperty.getStatus());
        verify(propertyRepository).save(testProperty);
        verify(auditLogPort).recordAction(eq(adminId), eq("EXPIRE_LISTING"), eq("Property"), eq(propertyId.toString()), eq(ListingModerationPolicy.STATUS_ACTIVE), eq(ListingModerationPolicy.STATUS_INACTIVE), anyString(), eq("127.0.0.1"), eq("SUCCESS"));
    }

    @Test
    void toggleHotDeal_Success() {
        when(propertyRepository.findById(propertyId)).thenReturn(Optional.of(testProperty));

        boolean result = moderationService.toggleHotDeal(propertyId, adminId, "127.0.0.1");

        assertTrue(result);
        assertTrue(testProperty.isHotDeal());
        verify(propertyRepository).save(testProperty);
        verify(auditLogPort).recordAction(eq(adminId), eq("TOGGLE_HOT_DEAL"), eq("Property"), eq(propertyId.toString()), eq("false"), eq("true"), anyString(), eq("127.0.0.1"), eq("SUCCESS"));
    }

    @Test
    void executeBulkAction_ApproveMultiple_Success() {
        UUID id2 = UUID.randomUUID();
        Property prop2 = new Property();
        prop2.setId(id2);
        prop2.setStatus(ListingModerationPolicy.STATUS_PENDING);

        when(propertyRepository.findById(propertyId)).thenReturn(Optional.of(testProperty));
        when(propertyRepository.findById(id2)).thenReturn(Optional.of(prop2));

        BulkListingActionRequest request = new BulkListingActionRequest(
                List.of(propertyId, id2),
                "APPROVE",
                null
        );

        BulkListingActionResultDto result = moderationService.executeBulkAction(request, adminId, "127.0.0.1");

        assertEquals(2, result.getTotalRequested());
        assertEquals(2, result.getSucceeded());
        assertEquals(0, result.getFailed());
        assertTrue(result.getErrors().isEmpty());
    }
}
