package com.hexahome.persistence.specification;

import com.hexahome.application.dto.admin.billing.AdminSubscriptionFilterRequest;
import com.hexahome.persistence.entity.Subscription;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.time.LocalTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

public class AdminSubscriptionSpecification {

    public static Specification<Subscription> build(AdminSubscriptionFilterRequest filter) {
        return (root, query, cb) -> {
            if (query != null && query.getResultType() != Long.class && query.getResultType() != long.class) {
                root.fetch("user", JoinType.LEFT);
                root.fetch("plan", JoinType.LEFT);
                query.distinct(true);
            }

            List<Predicate> predicates = new ArrayList<>();

            if (filter == null) {
                return cb.and(predicates.toArray(new Predicate[0]));
            }

            if (filter.getUserId() != null) {
                predicates.add(cb.equal(root.get("user").get("id"), filter.getUserId()));
            }

            if (StringUtils.hasText(filter.getPlanId())) {
                predicates.add(cb.equal(cb.lower(root.get("plan").get("id")), filter.getPlanId().trim().toLowerCase()));
            }

            if (StringUtils.hasText(filter.getStatus())) {
                predicates.add(cb.equal(cb.upper(root.get("status")), filter.getStatus().trim().toUpperCase()));
            }

            if (filter.getStartDate() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("startsAt"), filter.getStartDate().atStartOfDay().toInstant(ZoneOffset.UTC)));
            }

            if (filter.getEndDate() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("startsAt"), filter.getEndDate().atTime(LocalTime.MAX).toInstant(ZoneOffset.UTC)));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
