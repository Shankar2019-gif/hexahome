package com.hexahome.domain.policy;

import com.hexahome.domain.exception.BadRequestException;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class ListingModerationPolicyTest {

    @Test
    void validateApproval_Success() {
        assertDoesNotThrow(() -> ListingModerationPolicy.validateApproval(ListingModerationPolicy.STATUS_PENDING));
        assertDoesNotThrow(() -> ListingModerationPolicy.validateApproval(ListingModerationPolicy.STATUS_INACTIVE));
    }

    @Test
    void validateApproval_AlreadyActive_ThrowsException() {
        assertThrows(BadRequestException.class, () ->
                ListingModerationPolicy.validateApproval(ListingModerationPolicy.STATUS_ACTIVE));
    }

    @Test
    void validateRejection_ValidReason_Success() {
        assertDoesNotThrow(() ->
                ListingModerationPolicy.validateRejection(ListingModerationPolicy.STATUS_PENDING, "Missing tax proof"));
    }

    @Test
    void validateRejection_BlankReason_ThrowsException() {
        assertThrows(BadRequestException.class, () ->
                ListingModerationPolicy.validateRejection(ListingModerationPolicy.STATUS_PENDING, "   "));
        assertThrows(BadRequestException.class, () ->
                ListingModerationPolicy.validateRejection(ListingModerationPolicy.STATUS_PENDING, null));
    }

    @Test
    void validateExpiration_ActiveStatus_Success() {
        assertDoesNotThrow(() ->
                ListingModerationPolicy.validateExpiration(ListingModerationPolicy.STATUS_ACTIVE));
    }

    @Test
    void validateExpiration_NonActive_ThrowsException() {
        assertThrows(BadRequestException.class, () ->
                ListingModerationPolicy.validateExpiration(ListingModerationPolicy.STATUS_PENDING));
        assertThrows(BadRequestException.class, () ->
                ListingModerationPolicy.validateExpiration(ListingModerationPolicy.STATUS_INACTIVE));
    }

    @Test
    void validateBulkAction_TooManyItems_ThrowsException() {
        List<UUID> list = new ArrayList<>();
        for (int i = 0; i <= ListingModerationPolicy.MAX_BULK_ACTION_SIZE; i++) {
            list.add(UUID.randomUUID());
        }

        assertThrows(BadRequestException.class, () ->
                ListingModerationPolicy.validateBulkAction(list, "APPROVE", null));
    }

    @Test
    void validateBulkAction_InvalidAction_ThrowsException() {
        assertThrows(BadRequestException.class, () ->
                ListingModerationPolicy.validateBulkAction(Collections.singletonList(UUID.randomUUID()), "INVALID_ACTION", null));
    }
}
