package com.hexahome.persistence.specification;

import com.hexahome.persistence.entity.AdminUser;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class AdminStaffSpecification {

    public static Specification<AdminUser> build(String role, Boolean isActive, String keyword) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(role)) {
                predicates.add(cb.equal(cb.upper(root.get("role")), role.trim().toUpperCase()));
            }

            if (isActive != null) {
                predicates.add(cb.equal(root.get("isActive"), isActive));
            }

            if (StringUtils.hasText(keyword)) {
                String pattern = "%" + keyword.trim().toLowerCase() + "%";
                Predicate usernameMatch = cb.like(cb.lower(root.get("username")), pattern);
                Predicate emailMatch = cb.like(cb.lower(root.get("email")), pattern);
                Predicate nameMatch = cb.like(cb.lower(root.get("fullName")), pattern);
                predicates.add(cb.or(usernameMatch, emailMatch, nameMatch));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
