package com.hexahome.application.service;

import com.hexahome.application.dto.property.PropertyFilterRequest;
import com.hexahome.application.dto.property.PropertySummaryDto;
import com.hexahome.persistence.entity.City;
import com.hexahome.persistence.entity.Locality;
import com.hexahome.persistence.entity.Property;
import com.hexahome.persistence.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PropertyServiceTest {

    @Mock
    private PropertyRepository propertyRepository;
    @Mock
    private CityRepository cityRepository;
    @Mock
    private LocalityRepository localityRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private RoleRepository roleRepository;
    @Mock
    private AmenityRepository amenityRepository;

    private PropertyService propertyService;

    @BeforeEach
    void setUp() {
        propertyService = new PropertyService(
                propertyRepository,
                cityRepository,
                localityRepository,
                userRepository,
                roleRepository,
                amenityRepository
        );
    }

    @Test
    @DisplayName("searchProperties handles invalid/negative page and bounded size safely")
    void testSearchPropertiesDefensivePagination() {
        PropertyFilterRequest filter = new PropertyFilterRequest();
        filter.setPage(-5); // negative page
        filter.setSize(200); // oversized limit

        City city = new City();
        city.setName("Coimbatore");
        city.setSlug("coimbatore");

        Locality locality = new Locality();
        locality.setName("Peelamedu");
        locality.setSlug("peelamedu");

        Property p = new Property();
        p.setId(UUID.randomUUID());
        p.setSlug("test-property");
        p.setTitle("Test Property");
        p.setPrice(BigDecimal.valueOf(25000));
        p.setCity(city);
        p.setLocality(locality);

        when(propertyRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenAnswer(inv -> {
                    Pageable pageable = inv.getArgument(1);
                    assertEquals(0, pageable.getPageNumber(), "Page should be normalized to >= 0");
                    assertEquals(50, pageable.getPageSize(), "Size should be clamped to max 50");
                    return new PageImpl<>(List.of(p), pageable, 1);
                });

        Page<PropertySummaryDto> result = propertyService.searchProperties(filter);
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("test-property", result.getContent().get(0).getSlug());
    }

    @Test
    @DisplayName("getFeaturedCollection bounds limit properly")
    void testGetFeaturedCollectionBounding() {
        when(propertyRepository.findFeaturedByCityAndAdType(eq("coimbatore"), eq("RENT"), any(Pageable.class)))
                .thenReturn(List.of());

        List<PropertySummaryDto> result = propertyService.getFeaturedCollection("coimbatore", "RENT", -1);
        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(propertyRepository).findFeaturedByCityAndAdType(eq("coimbatore"), eq("RENT"), any(Pageable.class));
    }

    @Test
    @DisplayName("updateProperty succeeds when requester is the property owner")
    void testUpdatePropertyByOwnerSuccess() {
        UUID ownerId = UUID.randomUUID();
        UUID propId = UUID.randomUUID();

        com.hexahome.persistence.entity.User owner = new com.hexahome.persistence.entity.User();
        owner.setId(ownerId);
        owner.setPhone("9876543210");

        City city = new City();
        city.setName("Noida");
        city.setSlug("noida");

        Locality locality = new Locality();
        locality.setName("Sector 76");
        locality.setSlug("sector-76");

        Property p = new Property();
        p.setId(propId);
        p.setSlug("sample-property");
        p.setTitle("Old Title");
        p.setPrice(BigDecimal.valueOf(30000));
        p.setOwner(owner);
        p.setCity(city);
        p.setLocality(locality);
        p.setAdType("RENT");
        p.setPropertyType("FLAT");

        when(propertyRepository.findById(propId)).thenReturn(java.util.Optional.of(p));
        when(propertyRepository.save(any(Property.class))).thenAnswer(inv -> inv.getArgument(0));

        com.hexahome.application.dto.property.CreatePropertyRequest req = new com.hexahome.application.dto.property.CreatePropertyRequest();
        req.setTitle("Updated Title");
        req.setPrice(BigDecimal.valueOf(35000));

        com.hexahome.application.dto.property.PropertyDetailDto result = propertyService.updateProperty(propId, ownerId, req);

        assertNotNull(result);
        assertEquals("Updated Title", p.getTitle());
        assertEquals(BigDecimal.valueOf(35000), p.getPrice());
        verify(propertyRepository).save(p);
    }

    @Test
    @DisplayName("updateProperty throws ForbiddenException when requester is not the owner")
    void testUpdatePropertyByNonOwnerFails() {
        UUID ownerId = UUID.randomUUID();
        UUID attackerId = UUID.randomUUID();
        UUID propId = UUID.randomUUID();

        com.hexahome.persistence.entity.User owner = new com.hexahome.persistence.entity.User();
        owner.setId(ownerId);

        Property p = new Property();
        p.setId(propId);
        p.setOwner(owner);

        when(propertyRepository.findById(propId)).thenReturn(java.util.Optional.of(p));

        com.hexahome.application.dto.property.CreatePropertyRequest req = new com.hexahome.application.dto.property.CreatePropertyRequest();
        req.setTitle("Malicious Update");

        assertThrows(com.hexahome.domain.exception.ForbiddenException.class, () ->
                propertyService.updateProperty(propId, attackerId, req)
        );

        verify(propertyRepository, never()).save(any());
    }

    @Test
    @DisplayName("deleteProperty succeeds for property owner")
    void testDeletePropertyByOwnerSuccess() {
        UUID ownerId = UUID.randomUUID();
        UUID propId = UUID.randomUUID();

        com.hexahome.persistence.entity.User owner = new com.hexahome.persistence.entity.User();
        owner.setId(ownerId);

        Property p = new Property();
        p.setId(propId);
        p.setOwner(owner);
        p.setStatus("ACTIVE");

        when(propertyRepository.findById(propId)).thenReturn(java.util.Optional.of(p));

        propertyService.deleteProperty(propId, ownerId);

        assertEquals("INACTIVE", p.getStatus());
        verify(propertyRepository).save(p);
    }

    @Test
    @DisplayName("deleteProperty throws ForbiddenException for non-owner")
    void testDeletePropertyByNonOwnerFails() {
        UUID ownerId = UUID.randomUUID();
        UUID attackerId = UUID.randomUUID();
        UUID propId = UUID.randomUUID();

        com.hexahome.persistence.entity.User owner = new com.hexahome.persistence.entity.User();
        owner.setId(ownerId);

        Property p = new Property();
        p.setId(propId);
        p.setOwner(owner);

        when(propertyRepository.findById(propId)).thenReturn(java.util.Optional.of(p));

        assertThrows(com.hexahome.domain.exception.ForbiddenException.class, () ->
                propertyService.deleteProperty(propId, attackerId)
        );

        verify(propertyRepository, never()).save(any());
    }
}
