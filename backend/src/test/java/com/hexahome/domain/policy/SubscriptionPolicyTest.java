package com.hexahome.domain.policy;

import com.hexahome.domain.exception.BadRequestException;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class SubscriptionPolicyTest {

    @Test
    void validateExtension_ValidDays_Success() {
        assertDoesNotThrow(() -> SubscriptionPolicy.validateExtension(SubscriptionPolicy.STATUS_ACTIVE, 30));
        assertDoesNotThrow(() -> SubscriptionPolicy.validateExtension(SubscriptionPolicy.STATUS_EXPIRED, 1));
        assertDoesNotThrow(() -> SubscriptionPolicy.validateExtension(SubscriptionPolicy.STATUS_ACTIVE, 365));
    }

    @Test
    void validateExtension_ZeroOrNegativeDays_ThrowsBadRequestException() {
        assertThrows(BadRequestException.class, () ->
                SubscriptionPolicy.validateExtension(SubscriptionPolicy.STATUS_ACTIVE, 0));
        assertThrows(BadRequestException.class, () ->
                SubscriptionPolicy.validateExtension(SubscriptionPolicy.STATUS_ACTIVE, -5));
    }

    @Test
    void validateExtension_ExceedsMaxDays_ThrowsBadRequestException() {
        assertThrows(BadRequestException.class, () ->
                SubscriptionPolicy.validateExtension(SubscriptionPolicy.STATUS_ACTIVE, 366));
    }

    @Test
    void validateExtension_CancelledSubscription_ThrowsBadRequestException() {
        assertThrows(BadRequestException.class, () ->
                SubscriptionPolicy.validateExtension(SubscriptionPolicy.STATUS_CANCELLED, 15));
    }

    @Test
    void validateCancellation_ActiveSubscription_Success() {
        assertDoesNotThrow(() -> SubscriptionPolicy.validateCancellation(SubscriptionPolicy.STATUS_ACTIVE));
        assertDoesNotThrow(() -> SubscriptionPolicy.validateCancellation(SubscriptionPolicy.STATUS_EXPIRED));
    }

    @Test
    void validateCancellation_AlreadyCancelled_ThrowsBadRequestException() {
        assertThrows(BadRequestException.class, () ->
                SubscriptionPolicy.validateCancellation(SubscriptionPolicy.STATUS_CANCELLED));
    }

    @Test
    void validateCreditGrant_ValidCredits_Success() {
        assertDoesNotThrow(() -> SubscriptionPolicy.validateCreditGrant(1));
        assertDoesNotThrow(() -> SubscriptionPolicy.validateCreditGrant(50));
        assertDoesNotThrow(() -> SubscriptionPolicy.validateCreditGrant(500));
    }

    @Test
    void validateCreditGrant_ZeroOrNegative_ThrowsBadRequestException() {
        assertThrows(BadRequestException.class, () -> SubscriptionPolicy.validateCreditGrant(0));
        assertThrows(BadRequestException.class, () -> SubscriptionPolicy.validateCreditGrant(-10));
    }

    @Test
    void validateCreditGrant_ExceedsMax_ThrowsBadRequestException() {
        assertThrows(BadRequestException.class, () -> SubscriptionPolicy.validateCreditGrant(501));
    }
}
