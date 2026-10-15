package com.hexahome.persistence.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "reports")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid", updatable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reported_by_user_id")
    private User reportedByUser;

    @Column(nullable = false, length = 100)
    private String reason;

    @Column(columnDefinition = "text")
    private String comments;

    @Column(nullable = false, length = 30)
    private String status = "PENDING"; // PENDING, REVIEWED, RESOLVED, DISMISSED

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public Report() {
    }

    public Report(Property property, User reportedByUser, String reason, String comments) {
        this.property = property;
        this.reportedByUser = reportedByUser;
        this.reason = reason;
        this.comments = comments;
        this.status = "PENDING";
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Property getProperty() {
        return property;
    }

    public void setProperty(Property property) {
        this.property = property;
    }

    public User getReportedByUser() {
        return reportedByUser;
    }

    public void setReportedByUser(User reportedByUser) {
        this.reportedByUser = reportedByUser;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Report report = (Report) o;
        return Objects.equals(id, report.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
