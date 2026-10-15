package com.hexahome.persistence.specification;

import com.hexahome.application.dto.admin.system.AdminAuditLogFilterRequest;
import com.hexahome.persistence.entity.AdminAuditLog;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.time.LocalTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

public class AdminAuditLogSpecification {

    public static Specification<AdminAuditLog> build(AdminAuditLogFilterRequest filter) {
        return (root, query, cb) -> {
            if (query != null && query.getResultType() != Long.class && query.getResultType() != long.class) {
                root.fetch("admin", JoinType.LEFT);
                query.distinct(true);
            }

            List<Predicate> predicates = new ArrayList<>();

            if (filter == null) {
                return cb.and(predicates.toArray(new Predicate[0]));
            }

            if (filter.getAdminId() != null) {
                predicates.add(cb.equal(root.get("admin").get("id"), filter.getAdminId()));
            }

            if (StringUtils.hasText(filter.getAction())) {
                predicates.add(cb.equal(cb.upper(root.get("action")), filter.getAction().trim().toUpperCase()));
            }

            if (StringUtils.hasText(filter.getEntityType())) {
                predicates.add(cb.equal(cb.upper(root.get("entityType")), filter.getEntityType().trim().toUpperCase()));
            }

            if (StringUtils.hasText(filter.getEntityId())) {
                predicates.add(cb.equal(root.get("entityId"), filter.getEntityId().trim()));
            }

            if (StringUtils.hasText(filter.getOutcome())) {
                predicates.add(cb.equal(cb.upper(root.get("outcome")), filter.getOutcome().trim().toUpperCase()));
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
