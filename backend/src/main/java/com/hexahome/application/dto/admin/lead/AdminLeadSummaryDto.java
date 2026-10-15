package com.hexahome.application.dto.admin.lead;

import java.time.Instant;
import java.util.UUID;

public class AdminLeadSummaryDto {

    private UUID id;
    private UUID propertyId;
    private String propertyTitle;
    private String propertyShortId;
    private String seekerName;
    private String maskedPhone;
    private String status;
    private UUID assignedAdminId;
    private String assignedAdminName;
    private Instant assignedAt;
    private Instant createdAt;
    private Instant updatedAt;

    public AdminLeadSummaryDto() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getPropertyId() {
        return propertyId;
    }

    public void setPropertyId(UUID propertyId) {
        this.propertyId = propertyId;
    }

    public String getPropertyTitle() {
        return propertyTitle;
    }

    public void setPropertyTitle(String propertyTitle) {
        this.propertyTitle = propertyTitle;
    }

    public String getPropertyShortId() {
        return propertyShortId;
    }

    public void setPropertyShortId(String propertyShortId) {
        this.propertyShortId = propertyShortId;
    }

    public String getSeekerName() {
        return seekerName;
    }

    public void setSeekerName(String seekerName) {
        this.seekerName = seekerName;
    }

    public String getMaskedPhone() {
        return maskedPhone;
    }

    public void setMaskedPhone(String maskedPhone) {
        this.maskedPhone = maskedPhone;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public UUID getAssignedAdminId() {
        return assignedAdminId;
    }

    public void setAssignedAdminId(UUID assignedAdminId) {
        this.assignedAdminId = assignedAdminId;
    }

    public String getAssignedAdminName() {
        return assignedAdminName;
    }

    public void setAssignedAdminName(String assignedAdminName) {
        this.assignedAdminName = assignedAdminName;
    }

    public Instant getAssignedAt() {
        return assignedAt;
    }

    public void setAssignedAt(Instant assignedAt) {
        this.assignedAt = assignedAt;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
