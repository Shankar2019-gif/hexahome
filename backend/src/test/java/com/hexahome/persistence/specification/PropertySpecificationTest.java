package com.hexahome.persistence.specification;

import com.hexahome.application.dto.property.PropertyFilterRequest;
import com.hexahome.persistence.entity.Property;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertNotNull;

class PropertySpecificationTest {

    @Test
    @DisplayName("PropertySpecification builds cleanly for various filter permutations")
    void testPropertySpecificationBuildsCleanly() {
        PropertyFilterRequest filter = new PropertyFilterRequest();
        filter.setCity("Coimbatore");
        filter.setLocality("Ram Nagar");
        filter.setAdType("Buy"); // Should normalize to SALE
        filter.setPropertyType("Apartment / Flats"); // Should normalize to FLAT / APARTMENT
        filter.setBhk(List.of("2 BHK", "3BHK"));
        filter.setMinPrice(BigDecimal.valueOf(10000));
        filter.setMaxPrice(BigDecimal.valueOf(50000));
        filter.setFurnishing("SEMI_FURNISHED");
        filter.setPreferredTenant("FAMILY");
        filter.setVerifiedOnly(true);
        filter.setZeroBrokerageOnly(true);
        filter.setHotDealOnly(true);
        filter.setQ("Meadows");

        Specification<Property> spec = PropertySpecification.build(filter);
        assertNotNull(spec, "Specification should not be null");
    }

    @Test
    @DisplayName("PropertySpecification handles null filter cleanly")
    void testNullFilter() {
        Specification<Property> spec = PropertySpecification.build(null);
        assertNotNull(spec);
    }
}
