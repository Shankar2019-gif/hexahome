package com.hexahome.persistence.specification;

import com.hexahome.application.dto.admin.user.AdminUserFilterRequest;
import com.hexahome.persistence.entity.Role;
import com.hexahome.persistence.entity.User;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.time.LocalTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

public class AdminUserSpecification {

    public static Specification<User> build(AdminUserFilterRequest filter) {
        return (root, query, cb) -> {
            query.distinct(true);
            List<Predicate> predicates = new ArrayList<>();

            if (filter == null) {
                return cb.and(predicates.toArray(new Predicate[0]));
            }

            if (filter.getIsActive() != null) {
                predicates.add(cb.equal(root.get("isActive"), filter.getIsActive()));
            }

            if (filter.getIsVerified() != null) {
                predicates.add(cb.equal(root.get("isVerified"), filter.getIsVerified()));
            }

            if (StringUtils.hasText(filter.getRoleName())) {
                Join<User, Role> roleJoin = root.join("roles", JoinType.INNER);
                predicates.add(cb.equal(cb.upper(roleJoin.get("name")), filter.getRoleName().trim().toUpperCase()));
            }

            if (StringUtils.hasText(filter.getKeyword())) {
                String pattern = "%" + filter.getKeyword().trim().toLowerCase() + "%";
                Predicate phoneMatch = cb.like(cb.lower(root.get("phone")), pattern);
                Predicate emailMatch = cb.like(cb.lower(root.get("email")), pattern);
                Predicate nameMatch = cb.like(cb.lower(root.get("name")), pattern);
                Predicate firstNameMatch = cb.like(cb.lower(root.get("firstName")), pattern);
                Predicate lastNameMatch = cb.like(cb.lower(root.get("lastName")), pattern);
                predicates.add(cb.or(phoneMatch, emailMatch, nameMatch, firstNameMatch, lastNameMatch));
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
