package com.hexahome.application.dto.billing;

import java.time.Instant;

public class PaymentVerificationResponseDto {

    private String paymentId;
    private String orderId;
    private String status;
    private String planName;
    private int creditsAdded;
    private int totalRemainingCredits;
    private Instant expiresAt;

    public PaymentVerificationResponseDto() {
    }

    public PaymentVerificationResponseDto(String paymentId, String orderId, String status, String planName, int creditsAdded, int totalRemainingCredits, Instant expiresAt) {
        this.paymentId = paymentId;
        this.orderId = orderId;
        this.status = status;
        this.planName = planName;
        this.creditsAdded = creditsAdded;
        this.totalRemainingCredits = totalRemainingCredits;
        this.expiresAt = expiresAt;
    }

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPlanName() {
        return planName;
    }

    public void setPlanName(String planName) {
        this.planName = planName;
    }

    public int getCreditsAdded() {
        return creditsAdded;
    }

    public void setCreditsAdded(int creditsAdded) {
        this.creditsAdded = creditsAdded;
    }

    public int getTotalRemainingCredits() {
        return totalRemainingCredits;
    }

    public void setTotalRemainingCredits(int totalRemainingCredits) {
        this.totalRemainingCredits = totalRemainingCredits;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }
}
