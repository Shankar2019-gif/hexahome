package com.hexahome.persistence.specification;

import com.hexahome.application.dto.property.PropertyFilterRequest;
import com.hexahome.persistence.entity.Property;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class PropertySpecification {

    public static Specification<Property> build(PropertyFilterRequest filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Always restrict to ACTIVE status for public search unless specified otherwise
            predicates.add(cb.equal(root.get("status"), "ACTIVE"));

            if (filter == null) {
                return cb.and(predicates.toArray(new Predicate[0]));
            }

            // City (supports slug like 'coimbatore' or display name like 'Coimbatore')
            if (StringUtils.hasText(filter.getCity())) {
                String cityInput = filter.getCity().trim().toLowerCase();
                String citySlug = cityInput.replace(" ", "-");
                if ("bangalore".equals(cityInput) || "bangalore".equals(citySlug)) {
                    cityInput = "bengaluru";
                    citySlug = "bengaluru";
                }
                Predicate slugMatch = cb.like(cb.lower(root.get("city").get("slug")), "%" + citySlug + "%");
                Predicate nameMatch = cb.like(cb.lower(root.get("city").get("name")), "%" + cityInput + "%");
                predicates.add(cb.or(slugMatch, nameMatch));
            }

            // Locality (supports slug like 'ram-nagar' or display name like 'Ram Nagar')
            if (StringUtils.hasText(filter.getLocality())) {
                String locInput = filter.getLocality().trim().toLowerCase();
                String locSlug = locInput.replace(" ", "-");
                Predicate slugMatch = cb.like(cb.lower(root.get("locality").get("slug")), "%" + locSlug + "%");
                Predicate nameMatch = cb.like(cb.lower(root.get("locality").get("name")), "%" + locInput + "%");
                Predicate addressMatch = cb.like(cb.lower(root.get("address")), "%" + locInput + "%");
                Predicate titleMatch = cb.like(cb.lower(root.get("title")), "%" + locInput + "%");
                predicates.add(cb.or(slugMatch, nameMatch, addressMatch, titleMatch));
            }

            // Ad Type (RENT, SALE, PLOT, PG) - handles frontend variations like 'Buy' -> 'SALE', 'Co-living' -> 'PG'
            if (StringUtils.hasText(filter.getAdType())) {
                String adType = filter.getAdType().trim().toUpperCase();
                if ("BUY".equals(adType)) {
                    adType = "SALE";
                } else if ("CO-LIVING".equals(adType) || "COLIVING".equals(adType)) {
                    adType = "PG";
                } else if ("PLOTS".equals(adType)) {
                    adType = "PLOT";
                }
                predicates.add(cb.equal(cb.upper(root.get("adType")), adType));
            }

            // Property Type (FLAT, HOUSE, VILLA, COMMERCIAL, PLOT, PG) - handles frontend dropdown strings
            if (StringUtils.hasText(filter.getPropertyType())) {
                String pt = filter.getPropertyType().trim().toUpperCase();
                if (pt.contains("FLAT") || pt.contains("APARTMENT")) {
                    predicates.add(cb.or(
                            cb.equal(cb.upper(root.get("propertyType")), "FLAT"),
                            cb.equal(cb.upper(root.get("propertyType")), "APARTMENT")
                    ));
                } else if (pt.contains("HOUSE") || pt.contains("VILLA")) {
                    predicates.add(cb.or(
                            cb.equal(cb.upper(root.get("propertyType")), "HOUSE"),
                            cb.equal(cb.upper(root.get("propertyType")), "VILLA")
                    ));
                } else if (pt.contains("PLOT") || pt.contains("LAND")) {
                    predicates.add(cb.equal(cb.upper(root.get("propertyType")), "PLOT"));
                } else if (pt.contains("COMMERCIAL")) {
                    predicates.add(cb.equal(cb.upper(root.get("propertyType")), "COMMERCIAL"));
                } else {
                    predicates.add(cb.equal(cb.upper(root.get("propertyType")), pt));
                }
            }

            // BHK List - supports flexible formats ("2 BHK", "2BHK", "2")
            if (!CollectionUtils.isEmpty(filter.getBhk())) {
                List<String> normalizedBhk = filter.getBhk().stream()
                        .filter(StringUtils::hasText)
                        .flatMap(b -> {
                            String trimmed = b.trim();
                            String withSpace = trimmed.replaceAll("(?i)(\\d+)\\s*(bhk|rk)", "$1 $2").toUpperCase();
                            String withoutSpace = trimmed.replaceAll("\\s+", "").toUpperCase();
                            return java.util.stream.Stream.of(trimmed, withSpace, withoutSpace);
                        })
                        .distinct()
                        .toList();
                predicates.add(cb.upper(root.get("bhk")).in(normalizedBhk));
            }

            // Price range
            if (filter.getMinPrice() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), filter.getMinPrice()));
            }
            if (filter.getMaxPrice() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), filter.getMaxPrice()));
            }

            // Furnishing (UNFURNISHED, SEMI_FURNISHED, FULLY_FURNISHED)
            if (StringUtils.hasText(filter.getFurnishing())) {
                predicates.add(cb.equal(
                        cb.upper(root.get("furnishing")),
                        filter.getFurnishing().trim().toUpperCase()
                ));
            }

            // Preferred Tenant (FAMILY, BACHELORS, ANY)
            if (StringUtils.hasText(filter.getPreferredTenant())) {
                predicates.add(cb.equal(
                        cb.upper(root.get("preferredTenant")),
                        filter.getPreferredTenant().trim().toUpperCase()
                ));
            }

            // Boolean Flags
            if (Boolean.TRUE.equals(filter.getVerifiedOnly())) {
                predicates.add(cb.isTrue(root.get("isVerified")));
            }
            if (Boolean.TRUE.equals(filter.getZeroBrokerageOnly())) {
                predicates.add(cb.isTrue(root.get("isZeroBrokerage")));
            }
            if (Boolean.TRUE.equals(filter.getHotDealOnly())) {
                predicates.add(cb.isTrue(root.get("isHotDeal")));
            }

            // Comprehensive Keyword Text Search (title, address, locality, city, bhk, description)
            if (StringUtils.hasText(filter.getQ())) {
                String pattern = "%" + filter.getQ().trim().toLowerCase() + "%";
                Predicate titleMatch = cb.like(cb.lower(root.get("title")), pattern);
                Predicate addressMatch = cb.like(cb.lower(root.get("address")), pattern);
                Predicate bhkMatch = cb.like(cb.lower(root.get("bhk")), pattern);
                Predicate descMatch = cb.like(cb.lower(root.get("description")), pattern);
                Predicate locMatch = cb.like(cb.lower(root.get("locality").get("name")), pattern);
                Predicate cityMatch = cb.like(cb.lower(root.get("city").get("name")), pattern);
                predicates.add(cb.or(titleMatch, addressMatch, bhkMatch, descMatch, locMatch, cityMatch));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
