package com.hexahome.application.dto.admin.billing;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class ExtendSubscriptionRequest {

    @Min(value = 1, message = "Additional days must be at least 1")
    @Max(value = 365, message = "Additional days cannot exceed 365")
    private int additionalDays;

    @NotBlank(message = "Audit reason is required for subscription extensions")
    private String reason;

    public ExtendSubscriptionRequest() {
    }

    public ExtendSubscriptionRequest(int additionalDays, String reason) {
        this.additionalDays = additionalDays;
        this.reason = reason;
    }

    public int getAdditionalDays() {
        return additionalDays;
    }

    public void setAdditionalDays(int additionalDays) {
        this.additionalDays = additionalDays;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
