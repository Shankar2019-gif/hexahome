package com.hexahome.persistence.specification;

import com.hexahome.application.dto.admin.content.AdminReportFilterRequest;
import com.hexahome.persistence.entity.Report;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.time.LocalTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

public class AdminReportSpecification {

    public static Specification<Report> build(AdminReportFilterRequest filter) {
        return (root, query, cb) -> {
            if (query != null && query.getResultType() != Long.class && query.getResultType() != long.class) {
                root.fetch("property", JoinType.LEFT);
                root.fetch("reportedByUser", JoinType.LEFT);
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

            if (filter.getReportedByUserId() != null) {
                predicates.add(cb.equal(root.get("reportedByUser").get("id"), filter.getReportedByUserId()));
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
