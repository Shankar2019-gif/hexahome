package com.hexahome.domain.policy;

import com.hexahome.domain.exception.BadRequestException;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

/**
 * Domain Policy: Listing Moderation Rules.
 * Pure Java business policy with zero framework or persistence dependencies.
 */
public class ListingModerationPolicy {

    public static final String STATUS_PENDING = "PENDING_VERIFICATION";
    public static final String STATUS_ACTIVE = "ACTIVE";
    public static final String STATUS_INACTIVE = "INACTIVE";
    public static final String STATUS_REJECTED = "REJECTED";

    public static final int MAX_BULK_ACTION_SIZE = 50;

    public static void validateApproval(String currentStatus) {
        if (STATUS_ACTIVE.equalsIgnoreCase(currentStatus)) {
            throw new BadRequestException("Listing is already active and approved.");
        }
        if (!STATUS_PENDING.equalsIgnoreCase(currentStatus) && !STATUS_INACTIVE.equalsIgnoreCase(currentStatus)) {
            throw new BadRequestException("Cannot approve listing in status: " + currentStatus);
        }
    }

    public static void validateRejection(String currentStatus, String reason) {
        if (reason == null || reason.trim().isBlank()) {
            throw new BadRequestException("A valid rejection reason is mandatory.");
        }
        if (STATUS_REJECTED.equalsIgnoreCase(currentStatus)) {
            throw new BadRequestException("Listing has already been rejected.");
        }
    }

    public static void validateExpiration(String currentStatus) {
        if (STATUS_INACTIVE.equalsIgnoreCase(currentStatus)) {
            throw new BadRequestException("Listing is already inactive.");
        }
        if (!STATUS_ACTIVE.equalsIgnoreCase(currentStatus)) {
            throw new BadRequestException("Only currently active listings can be expired.");
        }
    }

    public static void validateBulkAction(List<UUID> propertyIds, String action, String reason) {
        if (propertyIds == null || propertyIds.isEmpty()) {
            throw new BadRequestException("Property IDs list cannot be empty for bulk operation.");
        }
        if (propertyIds.size() > MAX_BULK_ACTION_SIZE) {
            throw new BadRequestException("Bulk operations are limited to a maximum of " + MAX_BULK_ACTION_SIZE + " listings.");
        }
        if (action == null || action.trim().isBlank()) {
            throw new BadRequestException("Bulk action type is required.");
        }

        String normalizedAction = action.trim().toUpperCase();
        if (!normalizedAction.equals("APPROVE") && !normalizedAction.equals("REJECT") && !normalizedAction.equals("EXPIRE")) {
            throw new BadRequestException("Unsupported bulk action: " + action + ". Supported actions: APPROVE, REJECT, EXPIRE.");
        }

        if (normalizedAction.equals("REJECT") && (reason == null || reason.trim().isBlank())) {
            throw new BadRequestException("A valid rejection reason is mandatory for bulk rejection.");
        }
    }
}
