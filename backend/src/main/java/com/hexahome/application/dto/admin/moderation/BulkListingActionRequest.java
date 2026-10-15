package com.hexahome.application.dto.admin.moderation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;
import java.util.UUID;

public class BulkListingActionRequest {

    @NotEmpty(message = "Property IDs list cannot be empty")
    private List<UUID> propertyIds;

    @NotBlank(message = "Action type is required (APPROVE, REJECT, EXPIRE)")
    private String action;

    private String reason;

    public BulkListingActionRequest() {
    }

    public BulkListingActionRequest(List<UUID> propertyIds, String action, String reason) {
        this.propertyIds = propertyIds;
        this.action = action;
        this.reason = reason;
    }

    public List<UUID> getPropertyIds() {
        return propertyIds;
    }

    public void setPropertyIds(List<UUID> propertyIds) {
        this.propertyIds = propertyIds;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
