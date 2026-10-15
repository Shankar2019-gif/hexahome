package com.hexahome.application.dto.admin.billing;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class AdminSubscriptionDetailDto {

    private UUID id;
    private UUID userId;
    private String userName;
    private String maskedUserPhone;
    private String maskedUserEmail;

    private String planId;
    private String planName;
    private String targetRole;
    private BigDecimal planPrice;
    private Integer validityDays;
    private Integer totalCredits;
    private Integer remainingCredits;
    private Integer usedCredits;
    private boolean hasAssistedManager;
    private boolean instantWhatsappAlerts;

    private Instant startsAt;
    private Instant expiresAt;
    private String status;
    private boolean isExpired;

    public AdminSubscriptionDetailDto() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getMaskedUserPhone() {
        return maskedUserPhone;
    }

    public void setMaskedUserPhone(String maskedUserPhone) {
        this.maskedUserPhone = maskedUserPhone;
    }

    public String getMaskedUserEmail() {
        return maskedUserEmail;
    }

    public void setMaskedUserEmail(String maskedUserEmail) {
        this.maskedUserEmail = maskedUserEmail;
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

    public BigDecimal getPlanPrice() {
        return planPrice;
    }

    public void setPlanPrice(BigDecimal planPrice) {
        this.planPrice = planPrice;
    }

    public Integer getValidityDays() {
        return validityDays;
    }

    public void setValidityDays(Integer validityDays) {
        this.validityDays = validityDays;
    }

    public Integer getTotalCredits() {
        return totalCredits;
    }

    public void setTotalCredits(Integer totalCredits) {
        this.totalCredits = totalCredits;
    }

    public Integer getRemainingCredits() {
        return remainingCredits;
    }

    public void setRemainingCredits(Integer remainingCredits) {
        this.remainingCredits = remainingCredits;
    }

    public Integer getUsedCredits() {
        return usedCredits;
    }

    public void setUsedCredits(Integer usedCredits) {
        this.usedCredits = usedCredits;
    }

    public boolean isHasAssistedManager() {
        return hasAssistedManager;
    }

    public void setHasAssistedManager(boolean hasAssistedManager) {
        this.hasAssistedManager = hasAssistedManager;
    }

    public boolean isInstantWhatsappAlerts() {
        return instantWhatsappAlerts;
    }

    public void setInstantWhatsappAlerts(boolean instantWhatsappAlerts) {
        this.instantWhatsappAlerts = instantWhatsappAlerts;
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

    public boolean isExpired() {
        return isExpired;
    }

    public void setExpired(boolean expired) {
        this.isExpired = expired;
    }
}
