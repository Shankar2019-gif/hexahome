package com.hexahome.persistence.specification;

import com.hexahome.application.dto.admin.moderation.AdminPropertyFilterRequest;
import com.hexahome.persistence.entity.Property;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.time.LocalTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

public class AdminPropertySpecification {

    public static Specification<Property> build(AdminPropertyFilterRequest filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter == null) {
                return cb.and(predicates.toArray(new Predicate[0]));
            }

            if (StringUtils.hasText(filter.getStatus())) {
                predicates.add(cb.equal(cb.upper(root.get("status")), filter.getStatus().trim().toUpperCase()));
            }

            if (StringUtils.hasText(filter.getAdType())) {
                predicates.add(cb.equal(cb.upper(root.get("adType")), filter.getAdType().trim().toUpperCase()));
            }

            if (StringUtils.hasText(filter.getPropertyType())) {
                predicates.add(cb.equal(cb.upper(root.get("propertyType")), filter.getPropertyType().trim().toUpperCase()));
            }

            if (filter.getCityId() != null) {
                predicates.add(cb.equal(root.get("city").get("id"), filter.getCityId()));
            }

            if (filter.getOwnerId() != null) {
                predicates.add(cb.equal(root.get("owner").get("id"), filter.getOwnerId()));
            }

            if (filter.getIsHotDeal() != null) {
                predicates.add(cb.equal(root.get("isHotDeal"), filter.getIsHotDeal()));
            }

            if (filter.getIsVerified() != null) {
                predicates.add(cb.equal(root.get("isVerified"), filter.getIsVerified()));
            }

            if (StringUtils.hasText(filter.getKeyword())) {
                String pattern = "%" + filter.getKeyword().trim().toLowerCase() + "%";
                Predicate titleMatch = cb.like(cb.lower(root.get("title")), pattern);
                Predicate shortIdMatch = cb.like(cb.lower(root.get("shortId")), pattern);
                Predicate addressMatch = cb.like(cb.lower(root.get("address")), pattern);
                predicates.add(cb.or(titleMatch, shortIdMatch, addressMatch));
            }

            if (filter.getStartDate() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), filter.getStartDate().atStartOfDay().toInstant(ZoneOffset.UTC)));
            }

            if (filter.getEndDate() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), filter.getEndDate().atTime(LocalTime.MAX).toInstant(ZoneOffset.UTC)));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
