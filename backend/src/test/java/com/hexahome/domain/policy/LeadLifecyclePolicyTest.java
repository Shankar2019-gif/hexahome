package com.hexahome.domain.policy;

import com.hexahome.domain.exception.BadRequestException;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class LeadLifecyclePolicyTest {

    @Test
    void validateTransition_NewToContacted_Success() {
        assertDoesNotThrow(() -> LeadLifecyclePolicy.validateTransition(
                LeadLifecyclePolicy.STATUS_NEW,
                LeadLifecyclePolicy.STATUS_CONTACTED
        ));
    }

    @Test
    void validateTransition_NewToDropped_Success() {
        assertDoesNotThrow(() -> LeadLifecyclePolicy.validateTransition(
                LeadLifecyclePolicy.STATUS_NEW,
                LeadLifecyclePolicy.STATUS_DROPPED
        ));
    }

    @Test
    void validateTransition_ContactedToQualified_Success() {
        assertDoesNotThrow(() -> LeadLifecyclePolicy.validateTransition(
                LeadLifecyclePolicy.STATUS_CONTACTED,
                LeadLifecyclePolicy.STATUS_QUALIFIED
        ));
    }

    @Test
    void validateTransition_QualifiedToClosed_Success() {
        assertDoesNotThrow(() -> LeadLifecyclePolicy.validateTransition(
                LeadLifecyclePolicy.STATUS_QUALIFIED,
                LeadLifecyclePolicy.STATUS_CLOSED
        ));
    }

    @Test
    void validateTransition_DroppedToContacted_ReopeningSuccess() {
        assertDoesNotThrow(() -> LeadLifecyclePolicy.validateTransition(
                LeadLifecyclePolicy.STATUS_DROPPED,
                LeadLifecyclePolicy.STATUS_CONTACTED
        ));
    }

    @Test
    void validateTransition_SameStatus_ThrowsBadRequestException() {
        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                LeadLifecyclePolicy.validateTransition(
                        LeadLifecyclePolicy.STATUS_CONTACTED,
                        LeadLifecyclePolicy.STATUS_CONTACTED
                )
        );
        assertTrue(ex.getMessage().contains("already in status"));
    }

    @Test
    void validateTransition_ClosedToQualified_ThrowsBadRequestException() {
        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                LeadLifecyclePolicy.validateTransition(
                        LeadLifecyclePolicy.STATUS_CLOSED,
                        LeadLifecyclePolicy.STATUS_QUALIFIED
                )
        );
        assertTrue(ex.getMessage().contains("Invalid lead status transition"));
    }

    @Test
    void validateTransition_InvalidTarget_ThrowsBadRequestException() {
        assertThrows(BadRequestException.class, () ->
                LeadLifecyclePolicy.validateTransition(
                        LeadLifecyclePolicy.STATUS_NEW,
                        "UNKNOWN_STATE"
                )
        );
    }

    @Test
    void isAssignableRole_Validation() {
        assertTrue(LeadLifecyclePolicy.isAssignableRole("SALES"));
        assertTrue(LeadLifecyclePolicy.isAssignableRole("SUPPORT"));
        assertTrue(LeadLifecyclePolicy.isAssignableRole("SUPER_ADMIN"));
        assertFalse(LeadLifecyclePolicy.isAssignableRole("MODERATOR"));
        assertFalse(LeadLifecyclePolicy.isAssignableRole("CONTENT"));
        assertFalse(LeadLifecyclePolicy.isAssignableRole(null));
    }
}
