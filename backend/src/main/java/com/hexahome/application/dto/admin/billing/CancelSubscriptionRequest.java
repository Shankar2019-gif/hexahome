package com.hexahome.application.dto.admin.billing;

import jakarta.validation.constraints.NotBlank;

public class CancelSubscriptionRequest {

    @NotBlank(message = "Audit reason is required for subscription cancellation")
    private String reason;

    public CancelSubscriptionRequest() {
    }

    public CancelSubscriptionRequest(String reason) {
        this.reason = reason;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
