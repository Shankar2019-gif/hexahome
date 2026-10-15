package com.hexahome.domain.policy;

import com.hexahome.domain.exception.BadRequestException;

/**
 * Pure Java Domain Policy governing subscription lifecycle, extension caps, cancellation rules,
 * and credit adjustments.
 */
public final class SubscriptionPolicy {

    public static final String STATUS_ACTIVE = "ACTIVE";
    public static final String STATUS_EXPIRED = "EXPIRED";
    public static final String STATUS_CANCELLED = "CANCELLED";

    public static final int MAX_EXTENSION_DAYS = 365;
    public static final int MAX_MANUAL_CREDIT_GRANT = 500;

    private SubscriptionPolicy() {
    }

    public static void validateExtension(String currentStatus, int days) {
        if (days <= 0) {
            throw new BadRequestException("Extension days must be greater than zero");
        }
        if (days > MAX_EXTENSION_DAYS) {
            throw new BadRequestException("Extension days cannot exceed " + MAX_EXTENSION_DAYS + " days");
        }
        if (STATUS_CANCELLED.equalsIgnoreCase(currentStatus)) {
            throw new BadRequestException("Cannot extend a cancelled subscription");
        }
    }

    public static void validateCancellation(String currentStatus) {
        if (STATUS_CANCELLED.equalsIgnoreCase(currentStatus)) {
            throw new BadRequestException("Subscription is already cancelled");
        }
    }

    public static void validateCreditGrant(int credits) {
        if (credits <= 0) {
            throw new BadRequestException("Credits to grant must be greater than zero");
        }
        if (credits > MAX_MANUAL_CREDIT_GRANT) {
            throw new BadRequestException("Cannot grant more than " + MAX_MANUAL_CREDIT_GRANT + " credits in a single operation");
        }
    }
}
