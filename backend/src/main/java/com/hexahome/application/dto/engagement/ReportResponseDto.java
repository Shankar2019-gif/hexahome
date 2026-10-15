package com.hexahome.application.dto.engagement;

import com.hexahome.persistence.entity.Report;
import java.time.Instant;
import java.util.UUID;

public class ReportResponseDto {

    private UUID id;
    private UUID propertyId;
    private String reason;
    private String comments;
    private String status;
    private Instant createdAt;

    public ReportResponseDto() {
    }

    public ReportResponseDto(UUID id, UUID propertyId, String reason, String comments, String status, Instant createdAt) {
        this.id = id;
        this.propertyId = propertyId;
        this.reason = reason;
        this.comments = comments;
        this.status = status;
        this.createdAt = createdAt;
    }

    public static ReportResponseDto fromEntity(Report report) {
        if (report == null) return null;
        return new ReportResponseDto(
                report.getId(),
                report.getProperty() != null ? report.getProperty().getId() : null,
                report.getReason(),
                report.getComments(),
                report.getStatus(),
                report.getCreatedAt()
        );
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
