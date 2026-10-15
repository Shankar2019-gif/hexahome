package com.hexahome.application.dto.billing;

import com.hexahome.persistence.entity.Subscription;
import java.time.Instant;
import java.util.UUID;

public class UserSubscriptionDto {

    private UUID subscriptionId;
    private String planId;
    private String planName;
    private String targetRole;
    private int totalCredits;
    private int remainingCredits;
    private Instant startsAt;
    private Instant expiresAt;
    private String status;
    private boolean active;

    public UserSubscriptionDto() {
    }

    public static UserSubscriptionDto fromEntity(Subscription sub) {
        if (sub == null) return null;
        UserSubscriptionDto dto = new UserSubscriptionDto();
        dto.setSubscriptionId(sub.getId());
        if (sub.getPlan() != null) {
            dto.setPlanId(sub.getPlan().getId());
            dto.setPlanName(sub.getPlan().getName());
            dto.setTargetRole(sub.getPlan().getTargetRole());
        }
        dto.setTotalCredits(sub.getTotalCredits());
        dto.setRemainingCredits(sub.getRemainingCredits());
        dto.setStartsAt(sub.getStartsAt());
        dto.setExpiresAt(sub.getExpiresAt());
        dto.setStatus(sub.getStatus());
        dto.setActive(!sub.isExpired());
        return dto;
    }

    public UUID getSubscriptionId() {
        return subscriptionId;
    }

    public void setSubscriptionId(UUID subscriptionId) {
        this.subscriptionId = subscriptionId;
    }

    public String getPlanId() {
        return planId;
    }

    public void setPlanId(String planId) {
        this.planId = planId;
    }

    public String getPlanName() {
        return planName;
    }

    public void setPlanName(String planName) {
        this.planName = planName;
    }

    public String getTargetRole() {
        return targetRole;
    }

    public void setTargetRole(String targetRole) {
        this.targetRole = targetRole;
    }

    public int getTotalCredits() {
        return totalCredits;
    }

    public void setTotalCredits(int totalCredits) {
        this.totalCredits = totalCredits;
    }

    public int getRemainingCredits() {
        return remainingCredits;
    }

    public void setRemainingCredits(int remainingCredits) {
        this.remainingCredits = remainingCredits;
    }

    public Instant getStartsAt() {
        return startsAt;
    }

    public void setStartsAt(Instant startsAt) {
        this.startsAt = startsAt;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
