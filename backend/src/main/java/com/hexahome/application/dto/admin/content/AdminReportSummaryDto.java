package com.hexahome.application.dto.admin.content;

import java.time.Instant;
import java.util.UUID;

public class AdminReportSummaryDto {

    private UUID id;
    private UUID propertyId;
    private String propertyTitle;
    private String propertyShortId;
    private UUID reportedByUserId;
    private String reportedByName;
    private String reason;
    private String comments;
    private String status;
    private Instant createdAt;

    public AdminReportSummaryDto() {
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

    public UUID getReportedByUserId() {
        return reportedByUserId;
    }

    public void setReportedByUserId(UUID reportedByUserId) {
        this.reportedByUserId = reportedByUserId;
    }

    public String getReportedByName() {
        return reportedByName;
    }

    public void setReportedByName(String reportedByName) {
        this.reportedByName = reportedByName;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
