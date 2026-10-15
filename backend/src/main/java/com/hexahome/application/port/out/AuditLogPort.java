package com.hexahome.application.port.out;

import java.util.UUID;

/**
 * Onion Architecture Outbound Port: Audit Logging.
 * Defines the contract for recording administrative actions across the system.
 */
public interface AuditLogPort {

    void recordAction(
            UUID adminId,
            String action,
            String entityType,
            String entityId,
            String previousValue,
            String newValue,
            String reason,
            String ipAddress,
            String outcome
    );
}
