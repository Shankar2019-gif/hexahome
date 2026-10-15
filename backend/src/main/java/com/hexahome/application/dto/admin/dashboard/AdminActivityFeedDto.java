package com.hexahome.application.dto.admin.dashboard;

import java.time.Instant;
import java.util.UUID;

public class AdminActivityFeedDto {

    private UUID id;
    private String adminUsername;
    private String action;
    private String entityType;
    private String entityId;
    private String reason;
    private String outcome;
    private Instant createdAt;

    public AdminActivityFeedDto() {
    }

    public AdminActivityFeedDto(
            UUID id,
            String adminUsername,
            String action,
            String entityType,
            String entityId,
            String reason,
            String outcome,
            Instant createdAt) {
        this.id = id;
        this.adminUsername = adminUsername;
        this.action = action;
        this.entityType = entityType;
        this.entityId = entityId;
        this.reason = reason;
        this.outcome = outcome;
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getAdminUsername() {
        return adminUsername;
    }

    public void setAdminUsername(String adminUsername) {
        this.adminUsername = adminUsername;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getEntityType() {
        return entityType;
    }

    public void setEntityType(String entityType) {
        this.entityType = entityType;
    }

    public String getEntityId() {
        return entityId;
    }

    public void setEntityId(String entityId) {
        this.entityId = entityId;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getOutcome() {
        return outcome;
    }

    public void setOutcome(String outcome) {
        this.outcome = outcome;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
