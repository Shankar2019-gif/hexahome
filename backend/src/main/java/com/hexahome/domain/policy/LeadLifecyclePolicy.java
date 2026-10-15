package com.hexahome.domain.policy;

import com.hexahome.domain.exception.BadRequestException;

import java.util.Collections;
import java.util.Map;
import java.util.Set;

/**
 * Pure Java Domain Policy governing lead lifecycles, valid transitions, and assignment rules.
 */
public final class LeadLifecyclePolicy {

    public static final String STATUS_NEW = "NEW";
    public static final String STATUS_CONTACTED = "CONTACTED";
    public static final String STATUS_QUALIFIED = "QUALIFIED";
    public static final String STATUS_CLOSED = "CLOSED";
    public static final String STATUS_DROPPED = "DROPPED";

    public static final Set<String> ALL_STATUSES = Set.of(
            STATUS_NEW,
            STATUS_CONTACTED,
            STATUS_QUALIFIED,
            STATUS_CLOSED,
            STATUS_DROPPED
    );

    public static final Set<String> ASSIGNABLE_ADMIN_ROLES = Set.of(
            "SALES",
            "SUPPORT",
            "SUPER_ADMIN"
    );

    private static final Map<String, Set<String>> VALID_TRANSITIONS = Map.of(
            STATUS_NEW, Set.of(STATUS_CONTACTED, STATUS_DROPPED),
            STATUS_CONTACTED, Set.of(STATUS_QUALIFIED, STATUS_DROPPED),
            STATUS_QUALIFIED, Set.of(STATUS_CLOSED, STATUS_DROPPED),
            STATUS_DROPPED, Set.of(STATUS_CONTACTED),
            STATUS_CLOSED, Collections.emptySet()
    );

    private LeadLifecyclePolicy() {
    }

    public static void validateTransition(String currentStatus, String targetStatus) {
        if (targetStatus == null || targetStatus.isBlank()) {
            throw new BadRequestException("Target status is required");
        }

        String normalizedTarget = targetStatus.trim().toUpperCase();
        if (!ALL_STATUSES.contains(normalizedTarget)) {
            throw new BadRequestException("Unsupported lead status: " + targetStatus);
        }

        String normalizedCurrent = currentStatus != null ? currentStatus.trim().toUpperCase() : STATUS_NEW;

        if (normalizedCurrent.equalsIgnoreCase(normalizedTarget)) {
            throw new BadRequestException("Lead is already in status: " + normalizedCurrent);
        }

        Set<String> allowedNextStates = VALID_TRANSITIONS.getOrDefault(normalizedCurrent, Collections.emptySet());
        if (!allowedNextStates.contains(normalizedTarget)) {
            throw new BadRequestException(
                    String.format("Invalid lead status transition from '%s' to '%s'. Allowed: %s",
                            normalizedCurrent, normalizedTarget, allowedNextStates)
            );
        }
    }

    public static boolean isAssignableRole(String adminRole) {
        if (adminRole == null) {
            return false;
        }
        return ASSIGNABLE_ADMIN_ROLES.contains(adminRole.trim().toUpperCase());
    }
}
