package com.hexahome.persistence.specification;

import com.hexahome.application.dto.admin.lead.AdminLeadFilterRequest;
import com.hexahome.persistence.entity.Lead;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.time.LocalTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

public class AdminLeadSpecification {

    public static Specification<Lead> build(AdminLeadFilterRequest filter) {
        return (root, query, cb) -> {
            if (query != null && query.getResultType() != Long.class && query.getResultType() != long.class) {
                root.fetch("property", JoinType.LEFT);
                root.fetch("assignedAdmin", JoinType.LEFT);
                query.distinct(true);
            }

            List<Predicate> predicates = new ArrayList<>();

            if (filter == null) {
                return cb.and(predicates.toArray(new Predicate[0]));
            }

            if (StringUtils.hasText(filter.getStatus())) {
                predicates.add(cb.equal(cb.upper(root.get("status")), filter.getStatus().trim().toUpperCase()));
            }

            if (filter.getPropertyId() != null) {
                predicates.add(cb.equal(root.get("property").get("id"), filter.getPropertyId()));
            }

            if (filter.getAssignedAdminId() != null) {
                predicates.add(cb.equal(root.get("assignedAdmin").get("id"), filter.getAssignedAdminId()));
            }

            if (StringUtils.hasText(filter.getKeyword())) {
                String pattern = "%" + filter.getKeyword().trim().toLowerCase() + "%";
                Predicate nameMatch = cb.like(cb.lower(root.get("seekerName")), pattern);
                Predicate phoneMatch = cb.like(cb.lower(root.get("seekerPhone")), pattern);
                Predicate messageMatch = cb.like(cb.lower(root.get("message")), pattern);
                predicates.add(cb.or(nameMatch, phoneMatch, messageMatch));
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
